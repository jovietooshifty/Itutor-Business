-- ============================================================================
-- Hardening pass, driven by Supabase's security advisors.
--
-- 1. set_updated_at had a mutable search_path.
--
-- 2. Every SECURITY DEFINER helper and trigger function in `public` was exposed
--    by PostgREST as /rest/v1/rpc/<name> to anon and authenticated. Only three
--    are meant to be callable that way:
--        course_by_share_token, verify_certificate, quiz_questions_for_learner
--
--    NOTE: simply REVOKEing EXECUTE does NOT work — RLS policy expressions are
--    evaluated with the privileges of the CALLING role, so revoking EXECUTE
--    from `authenticated` makes every policy that calls a helper silently deny.
--    (Verified: doing so failed 6 of the 20 permission-matrix assertions.)
--
--    The correct fix is to move the internal functions out of the exposed
--    schema. PostgREST only exposes `public` and `graphql_public`, so functions
--    in `app_private` are unreachable over REST while policies and triggers —
--    which reference functions by OID, not by name — keep working untouched.
--    ALTER FUNCTION ... SET SCHEMA also preserves the existing EXECUTE grants.
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $fn$
begin
  new.updated_at := now();
  return new;
end $fn$;

create schema if not exists app_private;
grant usage on schema app_private to anon, authenticated;

comment on schema app_private is
  'Internal RLS helpers and trigger bodies. Not in PostgREST''s exposed schema list, so nothing here is reachable via /rest/v1/rpc.';

-- ── Internal RLS helpers ────────────────────────────────────────────────────
alter function public.current_user_type()                          set schema app_private;
alter function public.business_role(uuid)                          set schema app_private;
alter function public.is_business_member(uuid)                     set schema app_private;
alter function public.has_business_role(uuid, public.member_role[]) set schema app_private;
alter function public.is_business_admin(uuid)                      set schema app_private;
alter function public.can_edit_business_content(uuid)              set schema app_private;
alter function public.course_business_id(uuid)                     set schema app_private;
alter function public.block_business_id(uuid)                      set schema app_private;
alter function public.quiz_business_id(uuid)                       set schema app_private;
alter function public.can_read_course(uuid)                        set schema app_private;
alter function public.can_read_learner(uuid)                       set schema app_private;
alter function public.effective_quiz_navigation(uuid)              set schema app_private;

-- ── Trigger bodies (never called directly) ──────────────────────────────────
alter function public.set_updated_at()                             set schema app_private;
alter function public.enforce_quiz_retry_rule()                    set schema app_private;
alter function public.enforce_block_navigation_retry_rule()        set schema app_private;
alter function public.enforce_course_navigation_retry_rule()       set schema app_private;
alter function public.handle_new_user()                            set schema app_private;
alter function public.handle_auth_user_updated()                   set schema app_private;
alter function public.claim_pending_invites()                      set schema app_private;

-- Trigger bodies need no EXECUTE grant for anyone but the trigger owner.
revoke execute on function app_private.set_updated_at() from public, anon, authenticated;
revoke execute on function app_private.enforce_quiz_retry_rule() from public, anon, authenticated;
revoke execute on function app_private.enforce_block_navigation_retry_rule() from public, anon, authenticated;
revoke execute on function app_private.enforce_course_navigation_retry_rule() from public, anon, authenticated;
revoke execute on function app_private.handle_new_user() from public, anon, authenticated;
revoke execute on function app_private.handle_auth_user_updated() from public, anon, authenticated;
revoke execute on function app_private.claim_pending_invites() from public, anon, authenticated;

-- Helpers called from policy expressions must stay executable by the caller.
grant execute on function app_private.current_user_type() to anon, authenticated;
grant execute on function app_private.business_role(uuid) to anon, authenticated;
grant execute on function app_private.is_business_member(uuid) to anon, authenticated;
grant execute on function app_private.has_business_role(uuid, public.member_role[]) to anon, authenticated;
grant execute on function app_private.is_business_admin(uuid) to anon, authenticated;
grant execute on function app_private.can_edit_business_content(uuid) to anon, authenticated;
grant execute on function app_private.course_business_id(uuid) to anon, authenticated;
grant execute on function app_private.block_business_id(uuid) to anon, authenticated;
grant execute on function app_private.quiz_business_id(uuid) to anon, authenticated;
grant execute on function app_private.can_read_course(uuid) to anon, authenticated;
grant execute on function app_private.can_read_learner(uuid) to anon, authenticated;
grant execute on function app_private.effective_quiz_navigation(uuid) to anon, authenticated;

-- ── The three intentional RPCs stay in public with their grants ─────────────
grant execute on function public.course_by_share_token(text) to anon, authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;
grant execute on function public.quiz_questions_for_learner(uuid) to authenticated;

-- ── Repoint internal calls at app_private ─────────────────────────────────
-- SQL function bodies are stored as text and re-resolved at execution time, so
-- a helper whose body called public.business_role() would break after the move.
-- CREATE OR REPLACE preserves each OID, so dependent policies stay valid.

create or replace function app_private.is_business_member(p_business_id uuid)
returns boolean language sql stable security definer set search_path = public as $fn$
  select app_private.business_role(p_business_id) is not null;
$fn$;

create or replace function app_private.has_business_role(
  p_business_id uuid, p_roles public.member_role[]
) returns boolean language sql stable security definer set search_path = public as $fn$
  select app_private.business_role(p_business_id) = any (p_roles);
$fn$;

create or replace function app_private.is_business_admin(p_business_id uuid)
returns boolean language sql stable security definer set search_path = public as $fn$
  select app_private.business_role(p_business_id) = 'admin'::public.member_role;
$fn$;

create or replace function app_private.can_edit_business_content(p_business_id uuid)
returns boolean language sql stable security definer set search_path = public as $fn$
  select app_private.business_role(p_business_id)
         = any (array['admin', 'operator']::public.member_role[]);
$fn$;

create or replace function app_private.can_read_course(p_course_id uuid)
returns boolean language sql stable security definer set search_path = public as $fn$
  select exists (
    select 1
    from public.courses c
    where c.id = p_course_id
      and (
        c.visibility = 'public'::public.course_visibility
        or app_private.is_business_member(c.business_id)
        or exists (
          select 1 from public.enrollments e
          where e.course_id = c.id and e.learner_id = auth.uid()
        )
      )
  );
$fn$;

create or replace function app_private.can_read_learner(p_learner_id uuid)
returns boolean language sql stable security definer set search_path = public as $fn$
  select exists (
    select 1
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    where e.learner_id = p_learner_id
      and app_private.is_business_member(c.business_id)
  )
  or exists (
    select 1
    from public.learner_profiles lp
    where lp.user_id = p_learner_id
      and lp.employer_business_id is not null
      and app_private.is_business_member(lp.employer_business_id)
  );
$fn$;

create or replace function app_private.enforce_quiz_retry_rule()
returns trigger language plpgsql security definer set search_path = public as $fn$
declare
  v_nav public.quiz_navigation;
begin
  if new.retry_max is null and new.retry_cooldown_hours is null then
    return new;
  end if;

  v_nav := app_private.effective_quiz_navigation(new.block_id);

  if v_nav is distinct from 'allow_back'::public.quiz_navigation then
    raise exception
      'retry_max and retry_cooldown_hours must be NULL when the effective navigation is %; retries require allow_back (block %)',
      coalesce(v_nav::text, 'unresolved'), new.block_id
      using errcode = 'check_violation';
  end if;

  return new;
end $fn$;

-- Public RPC that calls a now-private helper.
create or replace function public.quiz_questions_for_learner(p_quiz_id uuid)
returns table (
  id uuid,
  "position" int,
  question_text text,
  options jsonb
)
language sql stable security definer set search_path = public as $fn$
  select q.id, q.position, q.question_text, q.options
  from public.quiz_questions q
  join public.quizzes z on z.id = q.quiz_id
  join public.course_blocks b on b.id = z.block_id
  where q.quiz_id = p_quiz_id
    and app_private.can_read_course(b.course_id)
  order by q.position, q.created_at;
$fn$;

grant execute on function public.quiz_questions_for_learner(uuid) to authenticated;

-- Quiz questions are for signed-in learners only; the other two RPCs are
-- deliberately anonymous (share-link lookup, no-login certificate check).
revoke execute on function public.quiz_questions_for_learner(uuid) from anon, public;
grant execute on function public.quiz_questions_for_learner(uuid) to authenticated;
