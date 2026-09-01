/* @ds-bundle: {"format":4,"namespace":"ITutorDesignSystem_e4581d","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Modal","sourcePath":"components/core/Modal.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"SearchField","sourcePath":"components/core/SearchField.jsx"},{"name":"StarRating","sourcePath":"components/core/StarRating.jsx"},{"name":"SubjectPill","sourcePath":"components/core/SubjectPill.jsx"},{"name":"VerifiedBadge","sourcePath":"components/core/VerifiedBadge.jsx"},{"name":"FaqItem","sourcePath":"components/patterns/FaqItem.jsx"},{"name":"GroupCard","sourcePath":"components/patterns/GroupCard.jsx"},{"name":"SidebarNavItem","sourcePath":"components/patterns/SidebarNavItem.jsx"},{"name":"StatCard","sourcePath":"components/patterns/StatCard.jsx"},{"name":"StepCard","sourcePath":"components/patterns/StepCard.jsx"},{"name":"TutorCard","sourcePath":"components/patterns/TutorCard.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"9da034beb211","components/core/Badge.jsx":"e3f0cc2b9b54","components/core/Button.jsx":"b64808f3cf12","components/core/Card.jsx":"1b248a5bc890","components/core/Checkbox.jsx":"0115fcabe638","components/core/Icon.jsx":"35119bfb5dcd","components/core/Input.jsx":"cce874a5ed87","components/core/Modal.jsx":"b5f9121b1795","components/core/ProgressBar.jsx":"acf1e68dbd0f","components/core/SearchField.jsx":"06265e272f2f","components/core/StarRating.jsx":"ca5fa62f28ea","components/core/SubjectPill.jsx":"29381d5a5be8","components/core/VerifiedBadge.jsx":"63042e03000d","components/patterns/FaqItem.jsx":"78e726ee6c90","components/patterns/GroupCard.jsx":"ff007463d923","components/patterns/SidebarNavItem.jsx":"6ff481d614d8","components/patterns/StatCard.jsx":"0f9d62db027e","components/patterns/StepCard.jsx":"2d08723f291a","components/patterns/TutorCard.jsx":"aae9fa580937","ui_kits/marketing/Hero.jsx":"932f538ff459","ui_kits/marketing/Nav.jsx":"a7add8769a76","ui_kits/marketing/Sections.jsx":"a1a5b2a7d722","ui_kits/parent-app/ParentData.jsx":"6a8c6ee71ec6","ui_kits/parent-app/ParentMobile.jsx":"d8e3772dc903","ui_kits/parent-app/ParentPhase1.jsx":"be89907fdfda","ui_kits/parent-app/ParentPhase2.jsx":"34a1e09fc547","ui_kits/parent-app/ParentPhase3.jsx":"70ca394f1bef","ui_kits/parent-app/ParentPhase4.jsx":"f5a2717238e6","ui_kits/parent-app/ParentShellView.jsx":"4c2d3576b1bf","ui_kits/parent-app/ios-frame.jsx":"24642b887be3","ui_kits/student-app/StudentScreens.jsx":"c66b7291b75c","ui_kits/student-app/StudentShellView.jsx":"a186a8672c74","ui_kits/student-app/StudentSpec.jsx":"f95fdf89265e","ui_kits/tutor-app/AIBadges.jsx":"b89d747ab673","ui_kits/tutor-app/ClientsView.jsx":"29b887e7c0bc","ui_kits/tutor-app/CreateSessionFlow.jsx":"9b5c22172978","ui_kits/tutor-app/PlannerData.jsx":"006ca401f3f6","ui_kits/tutor-app/PlannerScreen.jsx":"fb8ed0e8cf57","ui_kits/tutor-app/PlannerView.jsx":"6617b714450d","ui_kits/tutor-app/TutorScreens.jsx":"81d76fb7680e","ui_kits/tutor-app/TutorShellView.jsx":"86f2f628e650","ui_kits/tutor-app/TutorSpec.jsx":"5ab2fa256c16"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ITutorDesignSystem_e4581d = window.ITutorDesignSystem_e4581d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function Avatar({
  src,
  name = '',
  size = 40,
  hue = 145,
  rounded = 'full',
  ring = false
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  const radius = {
    full: '9999px',
    xl: 'var(--radius-lg)',
    '2xl': 'var(--radius-2xl)'
  }[rounded] || '9999px';
  const shell = {
    width: size,
    height: size,
    borderRadius: radius,
    overflow: 'hidden',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-semibold)',
    fontSize: size * 0.38,
    boxShadow: ring ? '0 0 0 2px #fff' : 'none',
    background: 'oklch(0.8 0.12 ' + hue + ')',
    color: 'oklch(0.25 0.05 ' + hue + ')'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: shell
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  success: {
    background: 'rgba(25,147,86,0.1)',
    color: 'var(--itutor-green)'
  },
  neutral: {
    background: 'var(--neutral-bg)',
    color: 'var(--neutral-fg)'
  },
  warning: {
    background: 'var(--warning-bg)',
    color: 'var(--warning-fg)'
  },
  danger: {
    background: 'var(--danger-bg)',
    color: 'var(--danger-fg)'
  },
  info: {
    background: 'var(--info-bg)',
    color: 'var(--info-fg)'
  },
  progress: {
    background: 'var(--progress-bg)',
    color: 'var(--progress-fg)'
  },
  amber: {
    background: '#fef3c7',
    color: '#b45309'
  },
  onImage: {
    background: 'rgba(255,255,255,0.9)',
    color: '#1f2937',
    backdropFilter: 'blur(4px)'
  },
  alert: {
    background: 'rgba(249,115,22,0.9)',
    color: '#fff',
    backdropFilter: 'blur(4px)'
  }
};
function Badge({
  children,
  tone = 'success',
  shape = 'pill',
  uppercase = false,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: uppercase ? '4px 10px' : '4px 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: uppercase ? 'var(--text-2xs)' : 'var(--text-xs)',
      fontWeight: uppercase ? 'var(--weight-bold)' : 'var(--weight-semibold)',
      textTransform: uppercase ? 'uppercase' : 'none',
      letterSpacing: uppercase ? '0.06em' : 0,
      borderRadius: shape === 'pill' ? 'var(--radius-full)' : 'var(--radius-sm)',
      ...TONES[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '8px 14px',
    fontSize: 'var(--text-xs)'
  },
  md: {
    padding: '10px 20px',
    fontSize: 'var(--text-sm)'
  },
  lg: {
    padding: '14px 28px',
    fontSize: 'var(--text-base)'
  }
};
const VARIANTS = {
  /* Marketing pill CTA — bg-brand, shadow-pop, hover scale 1.04 */
  marketing: {
    background: 'var(--brand)',
    color: '#fff',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    boxShadow: 'var(--shadow-pop)',
    fontWeight: 'var(--weight-semibold)'
  },
  /* Marketing secondary — white pill with 2px ink border */
  marketingSecondary: {
    background: '#fff',
    color: 'var(--ink)',
    borderRadius: 'var(--radius-full)',
    border: '2px solid rgba(17,24,39,0.1)',
    boxShadow: 'var(--shadow-card)',
    fontWeight: 'var(--weight-semibold)'
  },
  /* Dashboard primary — solid itutor-green, 12px radius */
  primary: {
    background: 'var(--itutor-green)',
    color: '#fff',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    fontWeight: 'var(--weight-bold)'
  },
  /* Gradient primary — used in the auth header and stat CTAs */
  gradient: {
    background: 'var(--gradient-brand)',
    color: '#fff',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    boxShadow: 'var(--shadow-button-green)',
    fontWeight: 'var(--weight-semibold)'
  },
  /* Dashboard outline — white, gray border, greens up on hover */
  secondary: {
    background: '#fff',
    color: '#4b5563',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    fontWeight: 'var(--weight-medium)'
  },
  /* Ink button — used on light banners ("Complete profile") */
  ink: {
    background: 'var(--ink)',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    fontWeight: 'var(--weight-semibold)'
  },
  /* Ghost on dark — nav "Sign Up" */
  ghostOnDark: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    fontWeight: 'var(--weight-medium)'
  },
  /* Outline on dark — CTA band secondary */
  outlineOnDark: {
    background: 'transparent',
    color: '#fff',
    borderRadius: 'var(--radius-full)',
    border: '2px solid rgba(255,255,255,0.4)',
    fontWeight: 'var(--weight-semibold)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  fullWidth = false,
  as = 'button',
  href,
  onClick,
  style,
  ...rest
}) {
  const Tag = as === 'a' ? 'a' : 'button';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--font-sans)',
    lineHeight: 1.2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.4 : 1
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: Tag === 'a' ? href : undefined,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    style: {
      ...base,
      ...SIZES[size],
      ...VARIANTS[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(var(--press-scale))';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
const {
  useState
} = React;
function Card({
  children,
  variant = 'dashboard',
  padding,
  hoverLift = true,
  style,
  onClick
}) {
  const [hover, setHover] = useState(false);
  const variants = {
    /* Dashboard card — white, gray-100 hairline, 16px radius, soft shadow */
    dashboard: {
      background: '#fff',
      border: '1px solid #f3f4f6',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-sm)'
    },
    /* Marketing card — 24px radius, translucent white, gray-100 border */
    marketing: {
      background: 'rgba(255,255,255,0.8)',
      border: '1px solid #f3f4f6',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-sm)',
      backdropFilter: 'blur(4px)'
    },
    /* Glass card — the featured tutor treatment */
    glass: {
      background: 'linear-gradient(135deg,rgba(255,255,255,0.7),rgba(255,255,255,0.2))',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: 'var(--radius-3xl)',
      boxShadow: 'var(--shadow-glass)',
      backdropFilter: 'blur(24px) saturate(150%)'
    },
    /* Inset panel — gray-50 block inside a card */
    inset: {
      background: 'var(--surface-inset)',
      border: '1px solid #f3f4f6',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'none'
    }
  };
  const lift = hoverLift && hover;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      padding: padding ?? 'var(--space-5)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      transform: lift ? 'translateY(var(--hover-lift-sm))' : 'none',
      cursor: onClick ? 'pointer' : undefined,
      ...variants[variant],
      boxShadow: lift ? 'var(--shadow-md)' : variants[variant].boxShadow,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  id,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-subtle)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      width: 16,
      height: 16,
      accentColor: 'var(--itutor-green)',
      borderRadius: 4,
      cursor: 'inherit'
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const {
  useEffect,
  useRef
} = React;
/**
 * Lucide icon (the icon set iTutor ships via lucide-react). Renders through the
 * lucide UMD build loaded from CDN in the host page.
 */
function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  color = 'currentColor',
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({
      nameAttr: 'data-lucide',
      attrs: {
        width: size,
        height: size,
        'stroke-width': strokeWidth,
        stroke: color
      },
      root: el
    });
  }, [name, size, strokeWidth, color]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input({
  label,
  hint,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  trailing,
  shape = 'rect',
  disabled = false,
  id,
  style
}) {
  const [focused, setFocused] = useState(false);
  const rounded = shape === 'pill' ? 'var(--radius-full)' : 'var(--radius-md)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: '#374151'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: id,
    type: type,
    placeholder: placeholder,
    value: value,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      padding: trailing ? '10px 40px 10px 12px' : '10px 12px',
      fontSize: 'var(--text-sm)',
      fontFamily: 'inherit',
      color: 'var(--ink)',
      background: disabled ? 'var(--surface-inset)' : '#fff',
      border: '1px solid ' + (error ? '#fca5a5' : focused ? 'var(--itutor-green)' : 'var(--surface-border)'),
      borderRadius: rounded,
      outline: 'none',
      boxShadow: focused && !error ? '0 0 0 2px #dcfce7' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }), trailing && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      display: 'grid',
      placeItems: 'center',
      color: '#9ca3af'
    }
  }, trailing)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger-fg)' : 'var(--text-subtle)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Modal.jsx
try { (() => {
const SIZES = {
  sm: 448,
  md: 512,
  lg: 672,
  xl: 896
};
function Modal({
  open = true,
  title,
  children,
  footer,
  size = 'md',
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: SIZES[size],
      background: '#fff',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: 'var(--space-6)',
      borderBottom: '1px solid var(--surface-border)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h3)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#111827'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: 6,
      border: 'none',
      background: 'transparent',
      borderRadius: 'var(--radius-md)',
      color: '#9ca3af',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6)',
      color: 'var(--ink)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: 'var(--space-6)',
      paddingTop: 0
    }
  }, footer))));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Modal.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  label,
  height = 6,
  tone = 'brand'
}) {
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      flex: 1,
      maxWidth: 320,
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: pct + '%',
      background: tone === 'brand' ? 'var(--brand)' : 'var(--coral)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--muted-foreground)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, label));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SearchField.jsx
try { (() => {
function SearchField({
  placeholder = 'Search tutors, subjects, topics…',
  value,
  onChange,
  width = '100%',
  shape = 'pill',
  onDark = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'grid',
      placeItems: 'center',
      color: onDark ? 'rgba(255,255,255,0.5)' : 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      width: '100%',
      padding: '8px 16px 8px 36px',
      fontSize: 'var(--text-sm)',
      fontFamily: 'inherit',
      color: onDark ? '#fff' : 'var(--ink)',
      background: onDark ? 'rgba(255,255,255,0.06)' : 'var(--muted)',
      border: '1px solid transparent',
      outline: 'none',
      borderRadius: shape === 'pill' ? 'var(--radius-full)' : 'var(--radius-md)'
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--brand)';
      e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.1)' : '#fff';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'transparent';
      e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.06)' : 'var(--muted)';
    }
  }));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/core/StarRating.jsx
try { (() => {
function Star({
  fill,
  size
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
    fill: fill
  }));
}
function StarRating({
  value,
  count,
  size = 16,
  tone = 'amber',
  showNumber = true
}) {
  const filled = Math.round(value);
  const color = tone === 'coral' ? 'var(--coral)' : 'var(--star)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 1
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Star, {
    key: i,
    size: size,
    fill: i <= filled ? color : '#e5e7eb'
  }))), showNumber && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, value.toFixed(1)), typeof count === 'number' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-subtle)'
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { StarRating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StarRating.jsx", error: String((e && e.message) || e) }); }

// components/core/SubjectPill.jsx
try { (() => {
function SubjectPill({
  children,
  tone = 'brand',
  size = 'md'
}) {
  const tones = {
    brand: {
      background: '#f0fdf4',
      color: 'var(--itutor-green)',
      border: '1px solid #bbf7d0'
    },
    neutral: {
      background: 'var(--neutral-bg)',
      color: '#4b5563',
      border: '1px solid transparent'
    }
  };
  const sizes = {
    sm: {
      padding: '2px 8px',
      fontSize: 'var(--text-3xs)'
    },
    md: {
      padding: '4px 12px',
      fontSize: 'var(--text-xs)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-medium)',
      ...sizes[size],
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { SubjectPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SubjectPill.jsx", error: String((e && e.message) || e) }); }

// components/core/VerifiedBadge.jsx
try { (() => {
function VerifiedBadge({
  size = 20,
  title = 'Verified iTutor'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    role: "img",
    "aria-label": title,
    style: {
      flexShrink: 0,
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("title", null, title), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "9",
    fill: "var(--itutor-green)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.2 10.3l2.4 2.4 5-5",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
Object.assign(__ds_scope, { VerifiedBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/VerifiedBadge.jsx", error: String((e && e.message) || e) }); }

// components/patterns/FaqItem.jsx
try { (() => {
const {
  useState
} = React;
function FaqItem({
  question,
  answer,
  defaultOpen = false,
  onDark = true
}) {
  const [open, setOpen] = useState(defaultOpen);
  const fg = onDark ? '#fff' : 'var(--ink)';
  const muted = onDark ? 'rgba(255,255,255,0.6)' : 'var(--text-subtle)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid ' + (onDark ? 'rgba(255,255,255,0.1)' : 'var(--border)'),
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(v => !v),
    style: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '16px 0',
      background: 'transparent',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      color: fg
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)'
    }
  }, question), /*#__PURE__*/React.createElement("span", {
    style: {
      color: muted,
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: open ? '1fr' : '0fr',
      overflow: 'hidden',
      transition: 'grid-template-rows var(--dur-slow) var(--ease-out)',
      paddingBottom: open ? 16 : 0,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: muted
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 0
    }
  }, answer)));
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/patterns/GroupCard.jsx
try { (() => {
const {
  useState
} = React;
function GroupCard({
  name,
  cover,
  coverGradient = 'linear-gradient(135deg,#34d399,#059669)',
  subjects = [],
  tutorName,
  tutorAvatar,
  rating,
  reviewCount = 0,
  members = 0,
  nextSession,
  length,
  price,
  priceSuffix = '/mo',
  spotsLeft,
  fillingFast = false,
  membership,
  onClick
}) {
  const [hover, setHover] = useState(false);
  const stars = '★'.repeat(Math.min(Math.round(rating || 0), 5)) + '☆'.repeat(Math.max(5 - Math.round(rating || 0), 0));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: '#fff',
      border: '1px solid ' + (hover ? '#10b981' : '#e5e7eb'),
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      transition: 'transform var(--dur-slow) var(--ease-out), box-shadow var(--dur-slow) var(--ease-out), border-color var(--dur-slow) var(--ease-out)',
      transform: hover ? 'translateY(var(--hover-lift))' : 'none',
      boxShadow: hover ? 'var(--shadow-hover-card)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 140,
      overflow: 'hidden',
      background: coverGradient
    }
  }, cover ? /*#__PURE__*/React.createElement("img", {
    src: cover,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 'var(--radius-2xl)',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(255,255,255,0.35)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "book-open",
    size: 28
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      maxWidth: '85%'
    }
  }, spotsLeft != null && spotsLeft > 0 && spotsLeft <= 5 && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "alert",
    shape: "rect",
    uppercase: true
  }, "Only ", spotsLeft, " spot", spotsLeft === 1 ? '' : 's', " left"), fillingFast && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "danger",
    shape: "rect",
    uppercase: true,
    style: {
      background: 'rgba(225,29,72,0.9)',
      color: '#fff'
    }
  }, "Filling fast"), membership === 'approved' && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "success",
    shape: "rect",
    uppercase: true
  }, "Member"), membership === 'pending' && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "amber",
    shape: "rect",
    uppercase: true
  }, "Requested")), subjects.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, subjects.slice(0, 2).map(s => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: s,
    tone: "onImage",
    shape: "rect"
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--card-padding)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      lineHeight: 'var(--leading-snug)',
      letterSpacing: 0,
      marginBottom: 4
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#64748b',
      margin: '0 0 12px'
    }
  }, members, " student", members === 1 ? '' : 's', " enrolled"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: tutorAvatar,
    name: tutorName,
    size: 30,
    hue: 150
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 'var(--weight-medium)',
      color: '#64748b'
    }
  }, tutorName)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--star)',
      fontSize: 13
    }
  }, stars), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#64748b'
    }
  }, reviewCount > 0 && rating != null ? rating.toFixed(1) + ' (' + reviewCount + ' reviews)' : 'No reviews yet')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 1,
      background: '#e5e7eb',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: 14
    }
  }, [['Members', members, '#111827'], ['Next', nextSession || 'Not scheduled', nextSession ? '#4f46e5' : '#ef4444'], ['Length', length || 'N/A', '#111827']].map(([l, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: '#fff',
      padding: '10px 12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#64748b',
      margin: '0 0 2px'
    }
  }, l), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: c,
      margin: 0
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 14,
      borderTop: '1px solid #e5e7eb'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: '#64748b'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 14
  }), length || 'N/A'), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: '#64748b'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "users",
    size: 14
  }), members > 0 ? members + ' members' : 'No members yet')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-extrabold)',
      color: price ? '#4f46e5' : '#059669'
    }
  }, price ? '$' + price + priceSuffix : 'Free'))));
}
Object.assign(__ds_scope, { GroupCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/GroupCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SidebarNavItem.jsx
try { (() => {
const {
  useState
} = React;
function SidebarNavItem({
  label,
  icon,
  active = false,
  tint,
  locked = false,
  collapsed = false,
  onClick
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? 0 : 12,
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? 8 : tint ? '8px' : '8px 12px',
      borderRadius: tint ? 'var(--radius-lg)' : 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: active ? '#fff' : 'rgba(255,255,255,0.7)',
      background: active ? 'rgba(255,255,255,0.1)' : hover ? 'rgba(255,255,255,0.05)' : 'transparent',
      opacity: locked ? 0.6 : 1,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
    }
  }, tint ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: tint.bg,
      color: tint.fg,
      boxShadow: 'inset 0 0 0 1px ' + tint.ring,
      opacity: active ? 1 : 0.8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), !collapsed && locked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 12,
    color: "rgba(255,255,255,0.4)"
  }));
}
Object.assign(__ds_scope, { SidebarNavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SidebarNavItem.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  icon = 'check-circle',
  tone = 'brand'
}) {
  const tones = {
    brand: {
      pill: 'rgba(25,147,86,0.1)',
      pillFg: 'var(--itutor-green)',
      value: 'var(--itutor-green)'
    },
    neutral: {
      pill: 'var(--neutral-bg)',
      pillFg: '#6b7280',
      value: '#111827'
    }
  }[tone];
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0,
      background: tones.pill,
      color: tones.pillFg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-h2)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 1,
      margin: '0 0 4px',
      color: tones.value
    }
  }, value), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: '#6b7280',
      margin: 0
    }
  }, label)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StepCard.jsx
try { (() => {
const {
  useState
} = React;
function StepCard({
  number,
  title,
  description,
  tag,
  icon = 'search',
  iconBg = '#dcfce7',
  iconColor = '#16a34a'
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      height: '100%',
      padding: 28,
      fontFamily: 'var(--font-sans)',
      background: 'rgba(255,255,255,0.8)',
      border: '1px solid #f3f4f6',
      borderRadius: 'var(--radius-2xl)',
      backdropFilter: 'blur(4px)',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(var(--hover-lift))' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out), box-shadow var(--dur-slow) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -16,
      left: 24,
      width: 36,
      height: 36,
      borderRadius: '9999px',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--gradient-brand)',
      color: '#fff',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-extrabold)',
      boxShadow: 'var(--shadow-md)'
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-2xl)',
      display: 'grid',
      placeItems: 'center',
      background: iconBg,
      color: iconColor,
      margin: '12px 0 20px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 32,
    strokeWidth: 2.2
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      fontWeight: 'var(--weight-extrabold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#0a0f0d',
      margin: '0 0 10px'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 'var(--leading-relaxed)',
      color: '#6b7280',
      margin: '0 0 20px'
    }
  }, description), tag && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      fontWeight: 'var(--weight-semibold)',
      color: '#16a34a'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 2.5
  }), tag));
}
Object.assign(__ds_scope, { StepCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StepCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/TutorCard.jsx
try { (() => {
function TutorCard({
  name,
  avatar,
  rating,
  ratingCount,
  verified = false,
  subjects = [],
  price,
  priceMax,
  compact = false,
  onView
}) {
  const shown = subjects.slice(0, 3);
  const remaining = subjects.length - shown.length;
  const priceLabel = price == null ? '$0.00' : priceMax && priceMax !== price ? '$' + price + '-$' + priceMax : '$' + price;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: compact ? 12 : 24,
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--radius-3xl)',
      border: '1px solid rgba(255,255,255,0.6)',
      background: 'linear-gradient(135deg,rgba(255,255,255,0.7),rgba(255,255,255,0.4) 50%,rgba(255,255,255,0.2))',
      boxShadow: 'var(--shadow-glass)',
      backdropFilter: 'blur(24px) saturate(150%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: compact ? 8 : 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: avatar,
    name: name,
    size: compact ? 48 : 64
  }), verified && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -4,
      bottom: -4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.VerifiedBadge, {
    size: compact ? 16 : 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: compact ? 'var(--text-sm)' : 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, rating ? /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    value: rating,
    count: ratingCount,
    size: compact ? 12 : 16
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-subtle)'
    }
  }, "New iTutor")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: compact ? 'var(--text-h4)' : 'var(--text-h3)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--itutor-green)'
    }
  }, priceLabel, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-regular)',
      color: '#6b7280'
    }
  }, "/hr TTD")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      gap: 6,
      marginTop: 16,
      minHeight: compact ? 68 : 88,
      flex: 1
    }
  }, shown.map(s => /*#__PURE__*/React.createElement(__ds_scope.SubjectPill, {
    key: s,
    size: compact ? 'sm' : 'md'
  }, s)), remaining > 0 && /*#__PURE__*/React.createElement(__ds_scope.SubjectPill, {
    tone: "neutral",
    size: compact ? 'sm' : 'md'
  }, "+", remaining, " more")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "gradient",
    size: compact ? 'sm' : 'md',
    fullWidth: true,
    onClick: onView,
    style: {
      marginTop: 'auto',
      fontWeight: 'var(--weight-bold)'
    }
  }, "View Profile"));
}
Object.assign(__ds_scope, { TutorCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/TutorCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
const {
  Button,
  Avatar,
  StarRating,
  Icon,
  VerifiedBadge
} = window.ITutorDesignSystem_e4581d;
function FloatCard({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      background: '#fff',
      borderRadius: 'var(--radius-2xl)',
      padding: 16,
      boxShadow: 'var(--shadow-card)',
      outline: '1px solid rgba(17,24,39,0.05)',
      ...style
    }
  }, children);
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "bg-mint-wash",
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: '96px 20px 128px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "animate-blob",
    style: {
      position: 'absolute',
      left: -128,
      top: 96,
      width: 320,
      height: 320,
      borderRadius: '9999px',
      background: 'color-mix(in oklab, var(--brand) 20%, transparent)',
      filter: 'blur(64px)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "animate-blob",
    style: {
      position: 'absolute',
      right: 0,
      top: '33%',
      width: 384,
      height: 384,
      borderRadius: '9999px',
      background: 'color-mix(in oklab, var(--coral) 15%, transparent)',
      filter: 'blur(64px)',
      animationDelay: '-6s',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 'var(--radius-full)',
      border: '1px solid color-mix(in oklab, var(--brand) 30%, transparent)',
      background: 'rgba(255,255,255,0.7)',
      padding: '6px 16px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--forest)',
      backdropFilter: 'blur(8px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '9999px',
      background: 'var(--brand)'
    }
  }), "Caribbean\u2019s No. 1 Tutoring Platform"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 24,
      fontSize: 72,
      fontWeight: 'var(--weight-bold)',
      lineHeight: 1.02,
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--ink)'
    }
  }, "Unlock Your", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-gradient-brand"
  }, "Academic Potential")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 28,
      maxWidth: 512,
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--ink-muted)'
    }
  }, "Connect with verified Caribbean tutors for CSEC, CAPE & beyond. Personalised 1-on-1 sessions that turn struggles into strengths."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "marketing",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16,
      color: "#fff"
    })
  }, "Find a Tutor"), /*#__PURE__*/React.createElement(Button, {
    variant: "marketingSecondary",
    size: "lg"
  }, "Become a Tutor")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, [12, 280, 200, 330, 60].map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginLeft: i ? -12 : 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: 'U' + i,
    hue: h,
    size: 42,
    ring: true
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StarRating, {
    value: 4.9,
    tone: "coral"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, "from ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "100+"), " student & parent reviews")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-3xl)',
      boxShadow: 'var(--shadow-pop)',
      outline: '1px solid rgba(17,24,39,0.05)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/hero-student.png",
    alt: "Caribbean tutor working with a student on a laptop",
    style: {
      display: 'block',
      width: '100%',
      height: 'auto'
    }
  })), /*#__PURE__*/React.createElement(FloatCard, {
    style: {
      left: -32,
      top: 40,
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Mr Ramdeen",
    hue: 30,
    size: 36
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Mr. Ramdeen"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Parent \xB7 Chaguanas"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(StarRating, {
    value: 5,
    tone: "coral",
    size: 12,
    showNumber: false
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'rgba(17,24,39,0.8)'
    }
  }, "My daughter pulled a 3 on her mocks. Weeks after joining iTutor, she came home with a Grade I \u2014 straight A\u2019s.")), /*#__PURE__*/React.createElement(FloatCard, {
    style: {
      right: -24,
      top: '36%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 20
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-h3)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 1,
      color: 'var(--ink)'
    }
  }, "150+"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Verified iTutors")))), /*#__PURE__*/React.createElement(FloatCard, {
    style: {
      right: 40,
      bottom: -24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--coral-soft)',
      color: 'var(--coral)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "94% pass rate"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Students scoring Grade I\u2013II")))))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Nav.jsx
try { (() => {
const {
  Button
} = window.ITutorDesignSystem_e4581d;
function MarketingNav() {
  const links = ['How it works', 'FAQ', 'About'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: 'var(--container-marketing)',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 40px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-logo-new.png",
    alt: "iTutor",
    style: {
      height: 48,
      width: 'auto',
      objectFit: 'contain',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#top",
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghostOnDark"
  }, "Sign Up"), /*#__PURE__*/React.createElement(Button, {
    variant: "gradient",
    style: {
      borderRadius: 'var(--radius-lg)',
      padding: '10px 22px',
      fontSize: 15
    }
  }, "Log In"))));
}
Object.assign(window, {
  MarketingNav
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Icon,
  StepCard,
  TutorCard,
  FaqItem
} = window.ITutorDesignSystem_e4581d;
function StatsBand() {
  const items = [{
    value: '1,000+',
    label: 'Active Students',
    color: 'var(--brand)'
  }, {
    value: '1,000+',
    label: 'Sessions Delivered',
    color: 'var(--coral)'
  }, {
    value: '25+',
    label: 'Subjects Covered',
    color: 'var(--brand-deep)'
  }, {
    value: '4.9★',
    label: 'Average Rating',
    color: 'var(--coral)'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 24px 64px',
      marginTop: -64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1024,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 1,
      background: 'var(--border)',
      borderRadius: 'var(--radius-3xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      background: '#fff',
      padding: 32,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: it.color,
      fontVariantNumeric: 'tabular-nums'
    }
  }, it.value), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, it.label)))));
}
const steps = [{
  number: '01',
  title: 'Find Your iTutor',
  description: 'Browse verified Caribbean tutors by subject, rating, and school. Filter to find your perfect match.',
  tag: '150+ verified tutors',
  icon: 'search',
  iconBg: '#ede9fe',
  iconColor: '#7c3aed'
}, {
  number: '02',
  title: 'Book a Session',
  description: 'Pick a time that fits your schedule. Sessions run on Google Meet or Zoom — no extra setup needed.',
  tag: 'Flexible scheduling',
  icon: 'calendar-days',
  iconBg: '#fce7f3',
  iconColor: '#db2777'
}, {
  number: '03',
  title: 'Learn & Grow',
  description: 'Get personalized 1-on-1 tutoring built around your learning style, pace, and exam goals.',
  tag: 'CSEC & CAPE Aligned',
  icon: 'book-open',
  iconBg: '#dcfce7',
  iconColor: '#16a34a'
}, {
  number: '04',
  title: 'Ace Your Exams',
  description: "Track progress, build confidence, and walk into your exam knowing you're ready.",
  tag: '94% Grade I–II rate',
  icon: 'target',
  iconBg: '#ffedd5',
  iconColor: '#ea580c'
}];
function HowItWorks() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(36px,5vw,60px)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      color: '#052e1a',
      marginBottom: 12
    }
  }, "How It ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'linear-gradient(90deg,#16a34a,#22c55e)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Works")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 auto',
      maxWidth: 520,
      fontSize: 'var(--text-lg)',
      color: '#4b5563'
    }
  }, "From first search to final exam \u2014 a clear path to your best grades.")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 24
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.number,
    style: {
      position: 'relative'
    }
  }, i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -14,
      top: 64,
      width: 24,
      borderTop: '2px dashed #86efac',
      zIndex: 10
    }
  }), /*#__PURE__*/React.createElement(StepCard, s)))));
}
const tutors = [{
  name: 'Anisa Mohammed',
  rating: 4.9,
  ratingCount: 42,
  verified: true,
  price: 120,
  subjects: ['CSEC Mathematics', 'Physics', 'Add Maths', 'Chemistry']
}, {
  name: 'Kavita Singh',
  rating: 4.8,
  ratingCount: 19,
  verified: true,
  price: 100,
  subjects: ['CAPE Biology', 'Chemistry', 'Integrated Science']
}, {
  name: 'Darren Joseph',
  rating: null,
  ratingCount: 0,
  verified: false,
  price: 90,
  subjects: ['English A', 'Literature', 'SBA Help']
}, {
  name: 'Shivani Bahadur',
  rating: 5,
  ratingCount: 8,
  verified: true,
  price: 150,
  subjects: ['SEA Preparation', 'Mathematics']
}];
function FeaturedTutors() {
  return /*#__PURE__*/React.createElement("section", {
    className: "bg-mint-wash",
    style: {
      padding: '80px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-content)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      marginBottom: 8
    }
  }, "Featured iTutors"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 32px',
      color: 'var(--ink-muted)'
    }
  }, "Verified Caribbean educators, rated by the students they teach."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 20
    }
  }, tutors.map(t => /*#__PURE__*/React.createElement(TutorCard, _extends({
    key: t.name
  }, t))))));
}
function SubjectPillsSection() {
  const subjects = ['CSEC', 'CAPE', 'Math', 'Chemistry', 'Biology', 'English A', 'SBA Help', 'Physics', 'Spanish'];
  const [active, setActive] = React.useState('CSEC');
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--itutor-black)',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--itutor-white)',
      marginBottom: 32
    }
  }, "Explore by Subject"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12
    }
  }, subjects.map(s => {
    const on = active === s;
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: () => setActive(s),
      style: {
        padding: '12px 24px',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-sm)',
        background: on ? 'linear-gradient(90deg,var(--itutor-green),#10b981)' : 'rgba(15,15,15,0.5)',
        color: on ? 'var(--itutor-black)' : 'var(--itutor-white)',
        border: on ? 'none' : '2px solid var(--itutor-border)',
        boxShadow: on ? '0 10px 15px -3px rgba(25,147,86,0.5)' : 'none',
        transform: on ? 'scale(1.05)' : 'none',
        transition: 'all var(--dur-slow) var(--ease-out)'
      }
    }, s);
  })));
}
function CtaBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      maxWidth: 'var(--container-content)',
      margin: '0 auto',
      borderRadius: 'var(--radius-band)',
      padding: 64,
      textAlign: 'center',
      boxShadow: 'var(--shadow-pop)',
      background: 'var(--gradient-cta-band)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -80,
      top: -80,
      width: 288,
      height: 288,
      borderRadius: '9999px',
      background: 'rgba(255,255,255,0.15)',
      filter: 'blur(64px)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      position: 'relative',
      fontSize: 48,
      fontWeight: 'var(--weight-bold)',
      lineHeight: 1.1,
      color: '#fff'
    }
  }, "Ready to ace your next exam?"), /*#__PURE__*/React.createElement("p", {
    style: {
      position: 'relative',
      margin: '16px auto 0',
      maxWidth: 576,
      color: 'rgba(255,255,255,0.85)'
    }
  }, "Join 1,000+ students across Trinidad & Tobago turning weak spots into Grade I results."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 32,
      display: 'flex',
      justifyContent: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "marketingSecondary",
    size: "lg",
    style: {
      border: 'none'
    },
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Find a Tutor"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlineOnDark",
    size: "lg"
  }, "Become a Tutor"))));
}
const faqs = [{
  q: 'What is iTutor?',
  a: 'iTutor is a Caribbean-built platform that connects students with verified 1-on-1 tutors for SEA, CSEC, and CAPE preparation.'
}, {
  q: 'Who are the iTutors?',
  a: 'All tutors are verified Caribbean educators — qualified teachers, top-graded graduates, and subject specialists vetted by our team.'
}, {
  q: 'Is iTutor safe for students?',
  a: 'Yes. Sessions run on Google Meet or Zoom, all tutors are background-checked, and parents can join or review every session.'
}, {
  q: 'Is it aligned with CSEC/CAPE?',
  a: 'Every tutor follows the latest CSEC and CAPE syllabuses, with past-paper practice built into every learning track.'
}, {
  q: 'How does booking work?',
  a: "Browse tutors, pick a time that suits you, and confirm — you'll get a calendar invite with the meeting link instantly."
}];
function Footer() {
  const company = ['About', 'How it works', 'FAQ', 'Become a Tutor'];
  const offers = ['CSEC Subjects', 'CAPE Subjects', 'SEA Preparation', 'Exam Preparation', 'Past Papers & SBAs'];
  const socials = ['facebook', 'instagram', 'linkedin', 'youtube'];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: '#000',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-marketing)',
      margin: '0 auto',
      padding: '80px 40px 40px',
      display: 'grid',
      gridTemplateColumns: '4fr 2fr 2fr 4fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-logo-new.png",
    alt: "iTutor",
    style: {
      height: 48,
      objectFit: 'contain',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      maxWidth: 384,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "The Caribbean\u2019s home for verified tutors. Built for SEA, CSEC and CAPE students who want real results."), /*#__PURE__*/React.createElement("a", {
    href: "mailto:support@myitutor.com",
    style: {
      marginTop: 24,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-sm)',
      color: 'rgba(255,255,255,0.8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16
  })), " support@myitutor.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      gap: 8
    }
  }, socials.map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#top",
    "aria-label": s,
    style: {
      width: 40,
      height: 40,
      borderRadius: '9999px',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.8)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s,
    size: 16
  }))))), [['Company', company], ['Programmes', offers]].map(([title, list]) => /*#__PURE__*/React.createElement("div", {
    key: title
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'rgba(255,255,255,0.5)'
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: '20px 0 0',
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 12,
      fontSize: 'var(--text-sm)'
    }
  }, list.map(c => /*#__PURE__*/React.createElement("li", {
    key: c
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      color: 'rgba(255,255,255,0.75)'
    }
  }, c)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'rgba(255,255,255,0.5)'
    }
  }, "Frequently Asked"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, faqs.map(f => /*#__PURE__*/React.createElement(FaqItem, {
    key: f.q,
    question: f.q,
    answer: f.a
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-marketing)',
      margin: '0 auto',
      padding: '24px 40px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      fontSize: 'var(--text-sm)',
      color: 'rgba(255,255,255,0.5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "\xA9 2026 iTutor \u2014 Astronova Technologies Ltd. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, ['Privacy', 'Terms', 'Help'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#top",
    style: {
      color: 'inherit'
    }
  }, l)))));
}
Object.assign(window, {
  StatsBand,
  HowItWorks,
  FeaturedTutors,
  SubjectPillsSection,
  CtaBand,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentData.jsx
try { (() => {
/* Shared fixtures for the parent kit. Child colours are the real defaults from
   ADD_CHILD_COLOR_CODING_FIXED.sql: #9333EA, #3B82F6, #10B981, #F59E0B …

   Model rules these fixtures encode:
   - Attendance is automatic and uneditable. Vocabulary is character-identical
     across parent, student and tutor kits: attended / late / absent, plus
     cancelled at session level.
   - Feedback is pull-based and optional. One request per child per month, shared
     between parent and student. Most sessions produce no feedback at all.
   - A pending request holds no seat and closes two hours before the session. */
const CHILDREN = [{
  id: 'c1',
  name: 'Aaliyah Ramkissoon',
  short: 'Aaliyah',
  color: '#9333EA',
  form: 'Form 5',
  sessionsThisWeek: 3,
  streak: 6,
  linkedOn: '2 Jul 2026',
  /* month to date, oldest first — tallies must match ATTENDANCE_SUMMARY.c1 */
  history: ['attended', 'absent', 'attended', 'cancelled', 'attended', 'attended', 'late', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended'],
  next: {
    subject: 'CSEC Mathematics',
    tutor: 'Anisa Mohammed',
    when: 'Today · 4:00 PM'
  },
  lastFeedback: 'Solved simultaneous equations unaided for the first time — moving to quadratics next.',
  lastFeedbackAt: '30 Aug 2026'
}, {
  id: 'c2',
  name: 'Josiah Ramkissoon',
  short: 'Josiah',
  color: '#3B82F6',
  form: 'Form 3',
  sessionsThisWeek: 2,
  streak: 2,
  linkedOn: '14 Aug 2026',
  /* month to date, oldest first — tallies must match ATTENDANCE_SUMMARY.c2 */
  history: ['attended', 'absent', 'attended', 'late', 'attended', 'attended', 'absent', 'attended', 'late', 'attended', 'attended'],
  next: {
    subject: 'CAPE Chemistry',
    tutor: 'Kavita Singh',
    when: 'Thu 4 Sep · 5:30 PM'
  },
  lastFeedback: null,
  lastFeedbackAt: null
}];

/* One feedback request per child per month, shared between parent and student.
   `usedBy` is who spent it — the parent must be able to see when the student did. */
const FEEDBACK_QUOTA = {
  c1: {
    used: true,
    usedBy: 'parent',
    usedOn: '4 Sep',
    month: 'September'
  },
  c2: {
    used: false,
    usedBy: null,
    usedOn: null,
    month: 'September'
  }
};

/* price is the amount as listed when the request was sent — it can differ from the
   tutor's current price, so every surface labels it as such.
   closesAt is session start − 2h. Nothing is reserved in the meantime. */
const REQUESTS = [{
  id: 'r1',
  childId: 'c1',
  subject: 'CSEC Mathematics — Paper 2 Drills',
  tutor: 'Anisa Mohammed',
  when: 'Sat 6 Sep · 10:00 AM',
  minutes: 90,
  priceWhenRequested: 180,
  requested: '2 hours ago',
  closesAt: 'Sat 6 Sep, 8:00 AM',
  closesIn: '2 days'
}, {
  id: 'r2',
  childId: 'c2',
  subject: 'CAPE Chemistry — Titration lab prep',
  tutor: 'Kavita Singh',
  when: 'Sun 7 Sep · 2:00 PM',
  minutes: 60,
  priceWhenRequested: 120,
  requested: 'Yesterday',
  closesAt: 'Sun 7 Sep, 12:00 PM',
  closesIn: '3 days'
}, {
  id: 'r3',
  childId: 'c1',
  subject: 'SEA Maths Clinic — free community class',
  tutor: 'Anisa Mohammed',
  when: 'Wed 10 Sep · 6:00 PM',
  minutes: 60,
  priceWhenRequested: 0,
  requested: '20 minutes ago',
  closesAt: 'Wed 10 Sep, 4:00 PM',
  closesIn: '6 days'
}];

/* Three outcomes: Approved, Declined, Expired. No email is sent on expiry, so the
   queue and the student's own pending list are the only places to discover it. */
const DECIDED = [{
  id: 'd1',
  childId: 'c1',
  subject: 'CSEC Mathematics',
  tutor: 'Anisa Mohammed',
  decision: 'Approved',
  total: 189,
  at: '28 Aug, 7:42 PM'
}, {
  id: 'd2',
  childId: 'c2',
  subject: 'Physics — SBA help',
  tutor: 'Marcus Alleyne',
  decision: 'Declined',
  total: 126,
  at: '24 Aug, 9:10 AM',
  reason: 'Clashes with football practice — try Saturdays.'
}, {
  id: 'd3',
  childId: 'c2',
  subject: 'CAPE Chemistry — Organic revision',
  tutor: 'Kavita Singh',
  decision: 'Expired',
  total: 120,
  at: '21 Aug, 3:00 PM',
  note: 'Closed unanswered two hours before the session. The seat went to another student.'
}];
const PARTICIPATION_OPTIONS = ['Yes', 'Occasionally', 'Not often', 'I can\u2019t recall the student ever participating'];

/* One unified feedback kind. Structure per §5.3: an auto-generated attendance
   block the tutor cannot edit, an optional note, participation, and free-text
   sections whose composition is still open (§7.1) — parameterised here. */
const FEEDBACK = [{
  id: 'f1',
  childId: 'c1',
  date: '30 Aug 2026',
  tutor: 'Anisa Mohammed',
  subject: 'CSEC Mathematics',
  requestedBy: 'parent',
  requestedOn: '27 Aug',
  covering: '4 sessions, 2–30 Aug',
  attendanceNote: 'The late arrival on 12 Aug was a school event, not a habit.',
  participation: 'Yes',
  freeText: [{
    key: 'performance',
    label: 'Performance',
    body: 'Aaliyah solved simultaneous equations unaided for the first time. She still writes the second equation before checking signs, which cost her one mark in the Jun 2023 question, but her setup is now reliable.'
  }, {
    key: 'focus',
    label: 'Focus next',
    body: 'Quadratics — factorising before the formula. Revisit sign errors at the start of the next session.'
  }]
}, {
  id: 'f2',
  childId: 'c1',
  date: '18 Jul 2026',
  tutor: 'Anisa Mohammed',
  subject: 'CSEC Mathematics',
  requestedBy: null,
  requestedOn: null,
  covering: '3 sessions, 1–18 Jul',
  attendanceNote: null,
  participation: 'Occasionally',
  freeText: [{
    key: 'performance',
    label: 'Performance',
    body: 'Comfortable expanding brackets, slower on transposing formulae. Accurate once she wrote each step out.'
  }]
}];

/* Only the five categories that produce a notification exist here. Attendance
   produces none, there is no digest, and parents get no session reminders. */
const NOTIFICATIONS = [{
  id: 'n1',
  type: 'booking',
  childId: 'c1',
  title: 'Aaliyah requested a class with Anisa Mohammed',
  body: 'CSEC Mathematics — Sat 6 Sep, 10:00 AM. Closes Sat 6 Sep, 8:00 AM.',
  at: '2 hours ago',
  unread: true,
  go: 'Approvals'
}, {
  id: 'n2',
  type: 'feedback',
  childId: 'c1',
  title: 'Anisa Mohammed filed feedback',
  body: 'CSEC Mathematics — answering your request of 27 Aug.',
  at: 'Yesterday',
  unread: true,
  go: 'Feedback'
}, {
  id: 'n3',
  type: 'payment',
  childId: 'c1',
  title: 'Payment failed — Maths Intensive',
  body: 'Visa ···· 4242 was declined. Aaliyah is not enrolled and the seat is open to others.',
  at: 'Yesterday',
  unread: true,
  go: 'Settings'
}, {
  id: 'n4',
  type: 'outcome',
  childId: 'c2',
  title: 'You declined Josiah\u2019s request',
  body: 'Physics — SBA help with Marcus Alleyne. Your reason was sent to him.',
  at: '24 Aug',
  unread: false,
  go: 'Approvals'
}, {
  id: 'n5',
  type: 'subscription',
  childId: 'c2',
  title: 'CAPE Chemistry subscription paused',
  body: 'Kavita Singh paused the class for the August holidays. Billing stops until it resumes.',
  at: '18 Aug',
  unread: false,
  go: 'Settings'
}];
const NOTIFICATION_CATEGORIES = [{
  key: 'booking',
  label: 'Booking requests',
  detail: 'A child asks to join a class'
}, {
  key: 'outcome',
  label: 'Approval outcomes',
  detail: 'Approved, declined or expired'
}, {
  key: 'payment',
  label: 'Payments',
  detail: 'Charges, failures and refunds'
}, {
  key: 'feedback',
  label: 'Feedback received',
  detail: 'A tutor files feedback'
}, {
  key: 'subscription',
  label: 'Subscription changes',
  detail: 'Paused, resumed or cancelled'
}];

/* The parent↔tutor conversation. Tutor-authored feedback is the structured primary
   content; parent replies are ordinary messages. Sparsity is the point: t3 has
   never had any feedback at all. kind: 'feedback' | 'chat'. */
const THREADS = [{
  id: 't1',
  childId: 'c1',
  tutor: 'Anisa Mohammed',
  avatar: '../../assets/team/liam-rampersad.jpg',
  subject: 'CSEC Mathematics',
  unread: 1,
  last: 'Feedback · 30 Aug — simultaneous equations solved unaided for the first time.',
  lastKind: 'feedback',
  at: '9:14 AM',
  messages: [{
    kind: 'feedback',
    from: 'tutor',
    at: '18 Jul, 8:02 PM',
    feedbackId: 'f2'
  }, {
    kind: 'chat',
    from: 'parent',
    at: '19 Jul, 7:40 AM',
    text: 'Thanks Anisa. She said transposing is the part she dreads — anything we can do at home?'
  }, {
    kind: 'chat',
    from: 'tutor',
    at: '19 Jul, 8:05 AM',
    text: 'Ten minutes a day rearranging three formulae. Short and often beats one long session.'
  }, {
    kind: 'chat',
    from: 'parent',
    at: '27 Aug, 6:14 PM',
    text: 'Requested feedback for August when you get a chance — no rush.'
  }, {
    kind: 'feedback',
    from: 'tutor',
    at: '30 Aug, 9:14 AM',
    feedbackId: 'f1'
  }]
}, {
  id: 't2',
  childId: 'c2',
  tutor: 'Kavita Singh',
  avatar: '../../assets/team/jovan-goodluck.jpg',
  subject: 'CAPE Chemistry',
  unread: 0,
  last: 'You: 6:00 PM works better for us too — thank you for moving it.',
  lastKind: 'chat',
  at: '23 Aug',
  messages: [{
    kind: 'chat',
    from: 'parent',
    at: '22 Aug, 8:30 PM',
    text: 'Josiah was late again — that\u2019s on us, traffic from San Fernando. Could we move him to 6:00 PM?'
  }, {
    kind: 'chat',
    from: 'tutor',
    at: '23 Aug, 9:02 AM',
    text: '6:00 PM works better for me too. I\u2019ve moved the recurring slot.'
  }, {
    kind: 'chat',
    from: 'parent',
    at: '23 Aug, 9:20 AM',
    text: '6:00 PM works better for us too — thank you for moving it.'
  }]
}, {
  id: 't3',
  childId: 'c2',
  tutor: 'Marcus Alleyne',
  avatar: null,
  subject: 'Physics — SBA help',
  unread: 0,
  last: 'No messages yet.',
  lastKind: null,
  at: '—',
  messages: []
}];

/* Read-only mirror of the student↔tutor thread, shown inside child detail.
   Scope starts at the link date; anything earlier stays private. */
const CHILD_THREADS = {
  c1: {
    tutor: 'Anisa Mohammed',
    subject: 'CSEC Mathematics',
    from: '2 Jul 2026',
    messages: [{
      from: 'student',
      at: '29 Aug, 3:12 PM',
      text: 'Miss, is Saturday\u2019s class paper 2 only or both papers?'
    }, {
      from: 'tutor',
      at: '29 Aug, 4:40 PM',
      text: 'Paper 2 only. Bring the Jun 2023 paper, we\u2019ll mark it together.'
    }, {
      from: 'student',
      at: '29 Aug, 4:44 PM',
      text: 'Ok. I couldn\u2019t finish question 4.'
    }, {
      from: 'tutor',
      at: '29 Aug, 5:01 PM',
      text: 'That\u2019s the one we\u2019ll start with then. Don\u2019t worry about finishing it tonight.'
    }]
  },
  c2: {
    tutor: 'Kavita Singh',
    subject: 'CAPE Chemistry',
    from: '14 Aug 2026',
    messages: [{
      from: 'tutor',
      at: '27 Aug, 7:15 PM',
      text: 'Josiah, bring your lab book Sunday — we\u2019ll go through the burette readings.'
    }, {
      from: 'student',
      at: '27 Aug, 8:02 PM',
      text: 'Yes miss.'
    }]
  }
};
const TRANSACTIONS = [{
  id: 'x1',
  date: '1 Sep 2026',
  childId: 'c1',
  desc: 'Maths Intensive — Anisa Mohammed',
  amount: 250,
  status: 'Failed'
}, {
  id: 'x2',
  date: '30 Aug 2026',
  childId: 'c1',
  desc: 'CSEC Mathematics 1:1 — Anisa Mohammed',
  amount: 189,
  status: 'Paid'
}, {
  id: 'x3',
  date: '29 Aug 2026',
  childId: 'c2',
  desc: 'CAPE Chemistry 1:1 — Kavita Singh',
  amount: 126,
  status: 'Paid'
}, {
  id: 'x4',
  date: '23 Aug 2026',
  childId: 'c1',
  desc: 'CSEC Mathematics 1:1 — Anisa Mohammed',
  amount: 189,
  status: 'Paid'
}, {
  id: 'x5',
  date: '18 Aug 2026',
  childId: 'c2',
  desc: 'Physics — SBA help (refunded)',
  amount: 126,
  status: 'Refunded'
}];

/* attendance: 'attended' | 'late' | 'absent' | 'cancelled' — derived from whether
   the student clicked Join, and from the join timestamp. Nobody can edit it, so no
   surface attributes it to a person. Upcoming events carry no attendance value. */
const SESSION_EVENTS = [{
  day: 2,
  childId: 'c1',
  subject: 'CSEC Mathematics',
  tutor: 'Anisa Mohammed',
  time: '4:00 PM',
  past: false
}, {
  day: 3,
  childId: 'c2',
  subject: 'CAPE Chemistry',
  tutor: 'Kavita Singh',
  time: '5:30 PM',
  past: false
}, {
  day: 5,
  childId: 'c1',
  subject: 'Maths Intensive (group)',
  tutor: 'Anisa Mohammed',
  time: '10:00 AM',
  past: false
}, {
  day: 6,
  childId: 'c2',
  subject: 'CAPE Chemistry lab prep',
  tutor: 'Kavita Singh',
  time: '2:00 PM',
  past: false
}, {
  day: 0,
  childId: 'c1',
  subject: 'CSEC Mathematics',
  tutor: 'Anisa Mohammed',
  time: '4:00 PM',
  past: true,
  attendance: 'attended'
}, {
  day: 0,
  childId: 'c2',
  subject: 'CAPE Chemistry',
  tutor: 'Kavita Singh',
  time: '6:00 PM',
  past: true,
  attendance: 'late',
  lateBy: 12
}, {
  day: 1,
  childId: 'c2',
  subject: 'CAPE Chemistry',
  tutor: 'Kavita Singh',
  time: '5:30 PM',
  past: true,
  attendance: 'absent'
}, {
  day: 1,
  childId: 'c1',
  subject: 'Maths Intensive (group)',
  tutor: 'Anisa Mohammed',
  time: '10:00 AM',
  past: true,
  attendance: 'attended'
}];
const ATTENDANCE = {
  attended: {
    label: 'Attended',
    icon: 'check',
    bg: 'rgba(25,147,86,0.1)',
    fg: 'var(--itutor-green)',
    tone: 'success'
  },
  late: {
    label: 'Late',
    icon: 'clock',
    bg: '#fffbeb',
    fg: '#b45309',
    tone: 'amber'
  },
  absent: {
    label: 'Absent',
    icon: 'x',
    bg: '#fef2f2',
    fg: '#dc2626',
    tone: 'danger'
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'ban',
    bg: 'var(--neutral-bg)',
    fg: '#6b7280',
    tone: 'neutral'
  }
};

/* Month-to-date attendance per child, tallied from the same history the grid draws.
   turnUp counts attended + late over sessions that actually ran; cancellations are
   excluded. Every percentage is rendered with `counted` beside it. */
const ATTENDANCE_SUMMARY = {};
CHILDREN.forEach(c => {
  const t = {
    attended: 0,
    late: 0,
    absent: 0,
    cancelled: 0
  };
  c.history.forEach(s => {
    t[s] += 1;
  });
  const counted = t.attended + t.late + t.absent;
  ATTENDANCE_SUMMARY[c.id] = {
    ...t,
    streak: c.streak,
    counted,
    turnUp: counted ? Math.round((t.attended + t.late) / counted * 100) : 0
  };
});
const childBy = id => CHILDREN.find(c => c.id === id) || {
  short: 'Family',
  name: 'Family',
  color: 'var(--ink-muted)'
};
const feedbackBy = id => FEEDBACK.find(f => f.id === id);
const money = n => '$' + Number(n).toLocaleString() + ' TTD';
/* "92% of 12 sessions" — a rate never ships without its denominator. */
const rateOf = childId => {
  const a = ATTENDANCE_SUMMARY[childId];
  return a.turnUp + '% of ' + a.counted + ' sessions';
};
Object.assign(window, {
  CHILDREN,
  FEEDBACK_QUOTA,
  REQUESTS,
  DECIDED,
  PARTICIPATION_OPTIONS,
  FEEDBACK,
  NOTIFICATIONS,
  NOTIFICATION_CATEGORIES,
  THREADS,
  CHILD_THREADS,
  TRANSACTIONS,
  SESSION_EVENTS,
  ATTENDANCE,
  ATTENDANCE_SUMMARY,
  childBy,
  feedbackBy,
  money,
  rateOf
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentData.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentMobile.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  StarRating,
  SubjectPill,
  VerifiedBadge,
  Input
} = window.ITutorDesignSystem_e4581d;

/* Mobile parent surface — Capacitor/iOS. 402pt wide, 44px minimum hit targets,
   single-column, child colour as a left-border accent exactly as on desktop.
   Billing lives under Settings inside More, not as a top-level entry. */

function Dot({
  color,
  size = 8
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '9999px',
      background: color,
      flexShrink: 0,
      display: 'inline-block'
    }
  });
}
function MHeader({
  title,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '62px 20px 12px',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      lineHeight: 1.15
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, sub)), right));
}
function MSubHeader({
  title,
  back,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '58px 12px 10px',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      minWidth: 44,
      minHeight: 44,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--itutor-green)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 22
  }), " ", back), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'center',
      marginRight: 60,
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, title));
}
function MTabBar({
  active,
  onNavigate,
  counts = {}
}) {
  const tabs = [{
    label: 'Home',
    icon: 'layout-dashboard',
    screen: 'Dashboard'
  }, {
    label: 'Approvals',
    icon: 'shield-check',
    screen: 'Approvals',
    badge: counts.approvals
  }, {
    label: 'Children',
    icon: 'users',
    screen: 'Child'
  }, {
    label: 'Calendar',
    icon: 'calendar-days',
    screen: 'Calendar'
  }, {
    label: 'More',
    icon: 'menu',
    screen: 'More'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      paddingBottom: 26,
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)'
    }
  }, tabs.map(t => {
    const on = t.screen === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.label,
      onClick: () => onNavigate(t.screen),
      style: {
        minHeight: 52,
        display: 'grid',
        placeItems: 'center',
        gap: 3,
        padding: '8px 0 4px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        color: on ? 'var(--itutor-green)' : '#9ca3af',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 22,
      strokeWidth: on ? 2.3 : 1.9
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: on ? 'var(--weight-bold)' : 'var(--weight-medium)'
      }
    }, t.label), t.badge ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 4,
        right: '50%',
        marginRight: -22,
        minWidth: 17,
        height: 17,
        padding: '0 4px',
        borderRadius: 9999,
        background: 'var(--brand)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 'var(--weight-bold)',
        display: 'grid',
        placeItems: 'center'
      }
    }, t.badge) : null);
  }));
}
function MBody({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 108px',
      display: 'grid',
      gap: 14,
      background: 'color-mix(in oklab, var(--muted) 30%, #fff)',
      minHeight: '100%'
    }
  }, children);
}
function MAttention({
  tone,
  children
}) {
  const bg = {
    amber: '#fffbeb',
    rose: '#fef2f2',
    purple: '#faf5ff'
  }[tone];
  const bd = {
    amber: '#fde68a',
    rose: '#fecaca',
    purple: '#e9d5ff'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      border: '1px solid ' + bd,
      borderRadius: 'var(--radius-lg)',
      padding: 14
    }
  }, children);
}
function MSeatNotice({
  closesAt
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 11,
      lineHeight: 'var(--leading-relaxed)',
      color: '#78350f'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "This spot isn\u2019t reserved."), " Another student can take it. Closes ", closesAt, ", two hours before the class.");
}

/* ── Dashboard ───────────────────────────────────────────────────────── */
function MDashboard({
  requests,
  onApprove,
  onDecline,
  onGo
}) {
  const failures = window.TRANSACTIONS.filter(t => t.status === 'Failed');
  const newFeedback = window.FEEDBACK.filter(f => f.id === 'f1');
  const count = requests.length + failures.length + newFeedback.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    title: "Family",
    sub: "Two children \xB7 5 classes this week",
    right: /*#__PURE__*/React.createElement("button", {
      onClick: () => onGo('Notifications'),
      style: {
        position: 'relative',
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 9999,
        border: 'none',
        background: 'transparent',
        color: '#6b7280',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 6,
        right: 6,
        minWidth: 17,
        height: 17,
        padding: '0 4px',
        borderRadius: 9999,
        background: 'var(--brand)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-sans)'
      }
    }, "3"))
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: count ? 14 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(245,158,11,0.14)',
      color: '#b45309',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell-ring",
    size: 17,
    strokeWidth: 1.9
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "Needs your attention"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '1px 0 0',
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, count ? count + (count === 1 ? ' item' : ' items') : 'Nothing waiting on you.'))), count === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(25,147,86,0.1)',
      color: 'var(--itutor-green)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-check",
    size: 16
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Nothing needs you. Aaliyah\u2019s next class is ", /*#__PURE__*/React.createElement("strong", null, "today at 4:00 PM"), ".")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, requests.map(r => {
    const child = window.childBy(r.childId);
    const free = r.priceWhenRequested === 0;
    return /*#__PURE__*/React.createElement(MAttention, {
      key: r.id,
      tone: "amber"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 'var(--weight-semibold)',
        color: '#4b5563'
      }
    }, child.short, " wants to join")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)',
        lineHeight: 1.3
      }
    }, r.subject), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-muted)',
        marginTop: 2
      }
    }, r.tutor, " \xB7 ", free ? 'Free class' : window.money(r.priceWhenRequested), " \xB7 closes ", r.closesAt), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => onApprove(r.id),
      style: {
        minHeight: 44
      }
    }, free ? 'Approve' : 'Approve & pay'), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onDecline(r.id),
      style: {
        minHeight: 44
      }
    }, "Decline")));
  }), failures.map(t => {
    const child = window.childBy(t.childId);
    return /*#__PURE__*/React.createElement(MAttention, {
      key: t.id,
      tone: "rose"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 'var(--weight-semibold)',
        color: '#4b5563'
      }
    }, child.short, " \xB7 ", t.desc.split(' — ')[0])), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 12px',
        fontSize: 13,
        color: '#374151',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Visa \xB7\xB7\xB7\xB7 4242 was declined on ", t.date, ". ", child.short, " is ", /*#__PURE__*/React.createElement("strong", null, "not enrolled"), " and the place is open to others."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      onClick: () => onGo('Checkout', 'failed'),
      style: {
        minHeight: 44
      }
    }, "Retry payment"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      fullWidth: true,
      onClick: () => onGo('Settings'),
      style: {
        minHeight: 44
      }
    }, "Update card")));
  }), newFeedback.map(f => {
    const child = window.childBy(f.childId);
    return /*#__PURE__*/React.createElement(MAttention, {
      key: f.id,
      tone: "purple"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: '#374151'
      }
    }, /*#__PURE__*/React.createElement("strong", null, f.tutor, " filed feedback"), " for ", child.short)), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      fullWidth: true,
      onClick: () => onGo('FeedbackDetail', f.id),
      style: {
        minHeight: 44
      }
    }, "Read feedback"));
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, "Your children"), window.CHILDREN.map(c => {
    const s = window.ATTENDANCE_SUMMARY[c.id];
    return /*#__PURE__*/React.createElement(Card, {
      key: c.id,
      padding: "14px",
      style: {
        borderLeft: '4px solid ' + c.color
      },
      onClick: () => onGo('Child', c.id)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      size: 40,
      hue: c.color === '#9333EA' ? 300 : 250
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, c.short)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-muted)'
      }
    }, c.next.subject, " \xB7 ", c.next.when)), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "#9ca3af"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        marginTop: 12,
        paddingTop: 10,
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)',
        lineHeight: 1
      }
    }, c.sessionsThisWeek), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--ink-muted)'
      }
    }, "this week")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 'var(--weight-bold)',
        color: c.color,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums'
      }
    }, s.turnUp, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--ink-muted)'
      }
    }, "of ", s.counted, " sessions"))), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '10px 0 0',
        fontSize: 11,
        color: c.lastFeedback ? '#4b5563' : '#9ca3af',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, c.lastFeedback ? '\u201c' + c.lastFeedback + '\u201d' : 'No feedback yet — you can request it once a month.'));
  })));
}

/* ── Approvals ───────────────────────────────────────────────────────── */
function MApprovals({
  requests,
  decided,
  onApprove,
  onDecline,
  onTutor
}) {
  const [declining, setDeclining] = React.useState(null);
  const [reason, setReason] = React.useState('');
  const outcomeTone = {
    Approved: 'success',
    Declined: 'neutral',
    Expired: 'amber'
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    title: "Requests",
    sub: "No place is held while you decide",
    right: requests.length ? /*#__PURE__*/React.createElement(Badge, {
      tone: "amber"
    }, requests.length, " pending") : null
  }), /*#__PURE__*/React.createElement(MBody, null, requests.length === 0 && /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: '#374151'
    }
  }, "No pending requests. When Aaliyah or Josiah asks to join a class, it comes here first.")), requests.map(r => {
    const child = window.childBy(r.childId);
    const free = r.priceWhenRequested === 0;
    return /*#__PURE__*/React.createElement(Card, {
      key: r.id,
      padding: "16px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + child.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color,
      size: 9
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, child.short), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#9ca3af'
      }
    }, "\xB7 ", r.requested)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 'var(--weight-semibold)',
        color: '#b45309'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 13
    }), " Closes ", r.closesAt)), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)',
        letterSpacing: 0,
        lineHeight: 1.3,
        marginBottom: 10
      }
    }, r.subject), /*#__PURE__*/React.createElement("button", {
      onClick: onTutor,
      style: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.tutor,
      size: 34,
      hue: 150
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        gap: 5
      }
    }, r.tutor, " ", /*#__PURE__*/React.createElement(VerifiedBadge, {
      size: 13
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--itutor-green)',
        fontWeight: 'var(--weight-medium)'
      }
    }, "View profile \u2192")), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      color: "#9ca3af"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 12,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-inset)',
        border: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#4b5563',
        marginBottom: 6
      }
    }, r.when, " \xB7 ", r.minutes, " min"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 'var(--weight-semibold)',
        color: '#6b7280'
      }
    }, "Price as listed when requested"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 800,
        color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.2
      }
    }, free ? 'Free' : window.money(r.priceWhenRequested)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        fontSize: 10,
        color: '#6b7280',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, free ? 'No payment involved — you are approving the enrolment.' : 'The tutor\u2019s current price may differ.')), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        background: '#fffbeb',
        border: '1px solid #fde68a'
      }
    }, /*#__PURE__*/React.createElement(MSeatNotice, {
      closesAt: r.closesAt
    })), declining === r.id ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: 'grid',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Reason (optional \u2014 sent word for word)",
      placeholder: "Clashes with football practice.",
      value: reason,
      onChange: e => setReason(e.target.value)
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      onClick: () => {
        onDecline(r.id, reason);
        setDeclining(null);
        setReason('');
      },
      style: {
        minHeight: 48
      }
    }, "Send decline"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      fullWidth: true,
      onClick: () => setDeclining(null),
      style: {
        minHeight: 44
      }
    }, "Keep pending")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      onClick: () => onApprove(r.id),
      style: {
        minHeight: 48
      }
    }, free ? 'Approve enrolment' : 'Approve & pay ' + window.money(r.priceWhenRequested)), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      fullWidth: true,
      onClick: () => setDeclining(r.id),
      style: {
        minHeight: 44
      }
    }, "Decline")));
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, "Past decisions"), /*#__PURE__*/React.createElement(Card, {
    padding: "4px 14px",
    hoverLift: false
  }, decided.map((d, i) => {
    const child = window.childBy(d.childId);
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        padding: '12px 0',
        borderTop: i ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 12,
        color: '#374151'
      }
    }, child.short, " \xB7 ", d.subject), /*#__PURE__*/React.createElement(Badge, {
      tone: outcomeTone[d.decision]
    }, d.decision)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 16,
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 2
      }
    }, d.at), d.note && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0 16px',
        fontSize: 10,
        color: '#6b7280',
        lineHeight: 1.45
      }
    }, d.note));
  }))));
}

/* ── Child detail ────────────────────────────────────────────────────── */
const M_TABS = ['Overview', 'Progress', 'Messages'];
function MChild({
  childId,
  onSwitch,
  onGo
}) {
  const [tab, setTab] = React.useState('Overview');
  const child = window.childBy(childId);
  const s = window.ATTENDANCE_SUMMARY[child.id];
  const items = window.FEEDBACK.filter(f => f.childId === childId);
  const q = window.FEEDBACK_QUOTA[childId];
  const thread = window.CHILD_THREADS[childId];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    title: child.short,
    sub: child.form + ' · linked since ' + child.linkedOn
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 20px',
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      gap: 8,
      overflowX: 'auto'
    }
  }, window.CHILDREN.map(c => {
    const on = c.id === childId;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => onSwitch(c.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 40,
        padding: '8px 14px',
        borderRadius: 9999,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 'var(--weight-semibold)',
        background: on ? 'color-mix(in oklab, ' + c.color + ' 10%, #fff)' : '#fff',
        border: '1px solid ' + (on ? c.color : 'var(--surface-border)'),
        color: on ? 'var(--ink)' : '#6b7280'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), c.short);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: '0 20px',
      background: '#fff',
      borderBottom: '1px solid var(--border)'
    }
  }, M_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      minHeight: 44,
      padding: '10px 12px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 'var(--weight-semibold)',
      color: tab === t ? 'var(--ink)' : '#9ca3af',
      borderBottom: '2px solid ' + (tab === t ? child.color : 'transparent'),
      marginBottom: -1
    }
  }, t))), /*#__PURE__*/React.createElement(MBody, null, tab === 'Overview' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid ' + child.color
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--itutor-green)'
    }
  }, "Next class"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      letterSpacing: 0
    }
  }, child.next.subject), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--ink-muted)'
    }
  }, child.next.when, " \xB7 ", child.next.tutor)), /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Attendance"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 'var(--weight-bold)',
      color: s.turnUp >= 90 ? 'var(--itutor-green)' : s.turnUp >= 75 ? '#b45309' : '#dc2626',
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.turnUp, "% of ", s.counted, " sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 6
    }
  }, child.history.map((st, i) => {
    const a = window.ATTENDANCE[st];
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      title: a.label,
      style: {
        height: 30,
        borderRadius: 6,
        background: a.fg,
        opacity: st === 'cancelled' ? 0.3 : st === 'attended' ? 0.5 + i / child.history.length * 0.5 : 1
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      marginTop: 12
    }
  }, [['attended', s.attended], ['late', s.late], ['absent', s.absent], ['cancelled', s.cancelled]].map(([k, v]) => {
    const a = window.ATTENDANCE[k];
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: '#4b5563'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: a.fg,
        opacity: k === 'cancelled' ? 0.35 : 1
      }
    }), /*#__PURE__*/React.createElement("strong", null, v), " ", a.label.toLowerCase());
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "Recorded automatically from when ", child.short, " joined each class."))), tab === 'Progress' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 4
    }
  }, "Request feedback"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12,
      color: 'var(--ink-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, q.used ? (q.usedBy === 'student' ? child.short + ' requested feedback on ' + q.usedOn + '.' : 'You requested feedback on ' + q.usedOn + '.') + ' You share one request a month — the next opens in October.' : 'One request a month, shared with ' + child.short + '. The tutor answers in their own time.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    disabled: q.used,
    style: {
      minHeight: 48
    }
  }, q.used ? 'Used this month' : 'Request feedback')), items.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    padding: "18px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 13,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "No feedback for ", child.short, " yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: '#6b7280',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Most classes produce none. Attendance is tracked either way.")) : items.map(f => /*#__PURE__*/React.createElement(Card, {
    key: f.id,
    padding: "14px",
    style: {
      borderLeft: '4px solid ' + child.color
    },
    onClick: () => onGo('FeedbackDetail', f.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, f.subject), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#9ca3af'
    }
  }, f.date)), /*#__PURE__*/React.createElement(Badge, {
    tone: f.requestedBy ? 'progress' : 'neutral'
  }, f.requestedBy ? 'You asked' : 'Sent unprompted'), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 12,
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, f.freeText[0].body)))), tab === 'Messages' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(14,165,233,0.08)',
      border: '1px solid rgba(14,165,233,0.25)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      fontWeight: 'var(--weight-semibold)',
      color: '#0c4a6e'
    }
  }, child.short, " can see that you have access to this conversation."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 11,
      color: '#075985',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Read-only. Messages from ", thread.from, " onward.")), /*#__PURE__*/React.createElement(Card, {
    padding: "14px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingBottom: 12,
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: thread.tutor,
    size: 34,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, child.short, " & ", thread.tutor), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, thread.subject)), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect",
    uppercase: true
  }, "Read only")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      paddingTop: 12
    }
  }, thread.messages.map((m, i) => {
    const fromChild = m.from === 'student';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: fromChild ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '82%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '9px 12px',
        borderRadius: 'var(--radius-lg)',
        background: fromChild ? 'color-mix(in oklab, ' + child.color + ' 14%, #fff)' : 'var(--surface-inset)',
        border: '1px solid ' + (fromChild ? 'color-mix(in oklab, ' + child.color + ' 30%, #fff)' : '#e5e7eb'),
        fontSize: 12,
        lineHeight: 'var(--leading-relaxed)',
        color: '#374151'
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontSize: 10,
        color: '#9ca3af',
        textAlign: fromChild ? 'right' : 'left'
      }
    }, fromChild ? child.short : thread.tutor, " \xB7 ", m.at)));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      paddingTop: 10,
      borderTop: '1px solid #f3f4f6',
      fontSize: 11,
      color: '#9ca3af'
    }
  }, "You cannot reply here. Use your own thread under Feedback.")))));
}

/* ── Feedback detail ─────────────────────────────────────────────────── */
function MFeedback({
  feedbackId,
  onBack
}) {
  const f = window.feedbackBy(feedbackId) || window.FEEDBACK[0];
  const child = window.childBy(f.childId);
  const s = window.ATTENDANCE_SUMMARY[f.childId];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MSubHeader, {
    title: "Feedback",
    back: child.short,
    onBack: onBack
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid ' + child.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingBottom: 14,
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: f.tutor,
    size: 40,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, f.subject), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, f.date, " \xB7 ", f.tutor, " \xB7 ", f.covering))), f.requestedBy && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(147,51,234,0.07)',
      border: '1px solid rgba(147,51,234,0.2)',
      fontSize: 11,
      color: '#5b21b6',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Answering a request ", f.requestedBy === 'parent' ? 'you' : child.short, " made on ", f.requestedOn, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 0',
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#6b7280'
    }
  }, "Attendance"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect"
  }, "Automatic")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      padding: 12,
      background: 'var(--surface-inset)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: 'var(--ink)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.turnUp, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-muted)'
    }
  }, "of ", s.counted)), [['attended', s.attended], ['late', s.late], ['absent', s.absent]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: window.ATTENDANCE[k].fg,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-muted)'
    }
  }, window.ATTENDANCE[k].label.toLowerCase())))), f.attendanceNote && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 12,
      color: '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9ca3af'
    }
  }, "Note: "), f.attendanceNote)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 0',
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#6b7280'
    }
  }, "Did ", child.short, " participate?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, window.PARTICIPATION_OPTIONS.map(o => {
    const on = o === f.participation;
    return /*#__PURE__*/React.createElement("div", {
      key: o,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 10px',
        borderRadius: 'var(--radius-md)',
        background: on ? 'rgba(25,147,86,0.07)' : 'transparent',
        border: '1px solid ' + (on ? 'rgba(25,147,86,0.35)' : '#f3f4f6')
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 15,
        height: 15,
        borderRadius: 9999,
        border: '2px solid ' + (on ? 'var(--itutor-green)' : '#d1d5db'),
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 9999,
        background: 'var(--itutor-green)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)',
        color: on ? 'var(--ink)' : '#6b7280',
        lineHeight: 1.35
      }
    }, o));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#6b7280'
    }
  }, "Written feedback"), /*#__PURE__*/React.createElement(Badge, {
    tone: "amber",
    shape: "rect",
    uppercase: true
  }, "TODO \xA77.1")), f.freeText.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.key,
    style: {
      padding: '10px 0',
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 3px',
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, x.label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 'var(--leading-relaxed)',
      color: '#374151'
    }
  }, x.body)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 10,
      color: '#9ca3af'
    }
  }, "Sent to you and to ", child.short, "."))));
}

/* ── Feedback threads ────────────────────────────────────────────────── */
function MThreads({
  onOpen
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    title: "Feedback",
    sub: "Your own thread with each tutor"
  }), /*#__PURE__*/React.createElement(MBody, null, window.THREADS.map(t => {
    const c = window.childBy(t.childId);
    const fb = t.messages.filter(m => m.kind === 'feedback');
    return /*#__PURE__*/React.createElement(Card, {
      key: t.id,
      padding: "14px",
      onClick: () => fb.length && onOpen(fb.slice(-1)[0].feedbackId)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: t.avatar,
      name: t.tutor,
      size: 38,
      hue: 150
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, t.tutor), t.unread > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        minWidth: 17,
        height: 17,
        padding: '0 5px',
        borderRadius: 9999,
        background: 'var(--brand)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        display: 'grid',
        placeItems: 'center'
      }
    }, t.unread)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        margin: '2px 0 6px'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#6b7280'
      }
    }, c.short, " \xB7 ", t.subject)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        background: fb.length ? 'rgba(147,51,234,0.1)' : 'var(--neutral-bg)',
        color: fb.length ? '#7c3aed' : '#9ca3af',
        fontSize: 10,
        fontWeight: 700
      }
    }, fb.length ? 'Feedback · ' + window.feedbackBy(fb.slice(-1)[0].feedbackId).date : 'No feedback yet'), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        fontSize: 11,
        color: 'var(--ink-muted)',
        lineHeight: 1.45
      }
    }, t.last))));
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: '#9ca3af',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Long gaps are normal \u2014 feedback comes when you request it and the tutor gets to it.")));
}

/* ── Tutor profile ───────────────────────────────────────────────────── */
function MTutor({
  onBack
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MSubHeader, {
    title: "Tutor profile",
    back: "Back",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: "../../assets/team/liam-rampersad.jpg",
    name: "Anisa Mohammed",
    size: 60,
    rounded: "2xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "Anisa Mohammed"), /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 17
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 6px',
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "CSEC & CAPE Maths \xB7 Chaguanas"), /*#__PURE__*/React.createElement(StarRating, {
    value: 4.9,
    count: 42,
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 12
    }
  }, ['CSEC Mathematics', 'Add Maths', 'CAPE Pure Maths'].map(s => /*#__PURE__*/React.createElement(SubjectPill, {
    key: s,
    size: "sm"
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 14,
      padding: '10px 12px',
      background: 'rgba(25,147,86,0.08)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge-check",
    size: 16,
    color: "var(--itutor-green)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#166534'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Verified iTutor"), " \u2014 identity confirmed 12 Mar 2025")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    style: {
      marginTop: 14,
      minHeight: 48
    },
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-square",
      size: 16,
      color: "#fff"
    })
  }, "Message Anisa")), /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 10
    }
  }, "Availability"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 6
    }
  }, [['Mon', '4–8 PM'], ['Wed', '4–8 PM'], ['Thu', '5–7 PM'], ['Sat', '9 AM–1 PM']].map(([d, t]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      background: 'rgba(25,147,86,0.08)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 6px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      color: '#6b7280'
    }
  }, d), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: '#166534',
      marginTop: 2
    }
  }, t))))), /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 8
    }
  }, "About"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 'var(--leading-relaxed)',
      color: '#4b5563'
    }
  }, "Secondary school Maths teacher for eleven years, eight of them on the CSEC syllabus. I work past paper by past paper."))));
}

/* ── Calendar agenda ─────────────────────────────────────────────────── */
function MCalendar() {
  const [shown, setShown] = React.useState(window.CHILDREN.map(c => c.id));
  const days = ['Mon 1', 'Tue 2', 'Wed 3', 'Thu 4', 'Fri 5', 'Sat 6', 'Sun 7'];
  const toggle = id => setShown(s => s.includes(id) ? s.filter(x => x !== id) : s.concat(id));
  const events = window.SESSION_EVENTS.filter(e => shown.includes(e.childId));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    title: "Calendar",
    sub: "September 2026 \xB7 this week"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 20px',
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      gap: 8
    }
  }, window.CHILDREN.map(c => {
    const on = shown.includes(c.id);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => toggle(c.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 40,
        padding: '8px 14px',
        borderRadius: 9999,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 'var(--weight-semibold)',
        background: on ? 'color-mix(in oklab, ' + c.color + ' 10%, #fff)' : '#fff',
        border: '1px solid ' + (on ? c.color : 'var(--surface-border)'),
        color: on ? 'var(--ink)' : '#9ca3af'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: on ? c.color : '#d1d5db'
    }), c.short);
  })), /*#__PURE__*/React.createElement(MBody, null, window.CHILDREN.filter(c => shown.includes(c.id)).map(c => {
    const s = window.ATTENDANCE_SUMMARY[c.id];
    return /*#__PURE__*/React.createElement(Card, {
      key: c.id,
      padding: "14px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + c.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, c.short), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: s.turnUp >= 90 ? 'var(--itutor-green)' : '#b45309',
        fontVariantNumeric: 'tabular-nums'
      }
    }, s.turnUp, "% of ", s.counted)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: 8,
        borderRadius: 9999,
        overflow: 'hidden',
        gap: 2,
        margin: '10px 0'
      }
    }, [['attended', s.attended], ['late', s.late], ['absent', s.absent], ['cancelled', s.cancelled]].filter(([, v]) => v > 0).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        width: v / (s.counted + s.cancelled) * 100 + '%',
        background: window.ATTENDANCE[k].fg,
        opacity: k === 'cancelled' ? 0.35 : 1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }
    }, [['attended', s.attended], ['late', s.late], ['absent', s.absent], ['cancelled', s.cancelled]].map(([k, v]) => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: '#4b5563'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 9999,
        background: window.ATTENDANCE[k].fg,
        opacity: k === 'cancelled' ? 0.35 : 1
      }
    }), /*#__PURE__*/React.createElement("strong", null, v), " ", window.ATTENDANCE[k].label.toLowerCase()))));
  }), days.map((d, i) => {
    const dayEvents = events.filter(e => e.day === i);
    return /*#__PURE__*/React.createElement("div", {
      key: d
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 6px',
        fontSize: 11,
        fontWeight: 'var(--weight-semibold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-eyebrow)',
        color: '#9ca3af'
      }
    }, d), dayEvents.length === 0 ? /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12,
        color: '#d1d5db'
      }
    }, "No classes") : dayEvents.map(e => {
      const c = window.childBy(e.childId);
      const a = e.attendance ? window.ATTENDANCE[e.attendance] : null;
      return /*#__PURE__*/React.createElement("div", {
        key: e.subject + e.time,
        style: {
          padding: 12,
          borderRadius: 'var(--radius-lg)',
          marginBottom: 8,
          background: a ? a.bg : 'color-mix(in oklab, ' + c.color + ' 8%, #fff)',
          border: '1px solid #f3f4f6',
          borderLeft: '4px solid ' + (a ? a.fg : c.color)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(Dot, {
        color: c.color
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 'var(--weight-bold)',
          color: 'var(--ink)'
        }
      }, e.time), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: '#6b7280'
        }
      }, "\xB7 ", c.short), a && /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 9999,
          background: a.fg,
          color: '#fff',
          fontSize: 10,
          fontWeight: 'var(--weight-bold)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: a.icon,
        size: 10,
        strokeWidth: 3
      }), a.label)), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 3,
          fontSize: 13,
          color: '#374151'
        }
      }, e.subject), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: '#9ca3af'
        }
      }, e.tutor, e.lateBy ? ' · joined ' + e.lateBy + ' min late' : ''));
    }));
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 4
    }
  }, "Add to your calendar"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12,
      color: 'var(--ink-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Paste the link into Google, Apple or Outlook Calendar and every class stays in sync."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    style: {
      minHeight: 44
    },
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-plus",
      size: 16
    })
  }, "Copy subscribe link"))));
}

/* ── More hub ────────────────────────────────────────────────────────── */
function MMore({
  onGo
}) {
  const rows = [['message-square-quote', 'Feedback & messages', '1 new from tutors', 'rgba(244,63,94,0.12)', '#e11d48', 'Feedback'], ['bell', 'Notifications', '3 new', 'rgba(139,92,246,0.12)', '#7c3aed', 'Notifications'], ['users', 'Children', '2 linked', 'rgba(147,51,234,0.12)', '#7c3aed', 'Child'], ['search', 'Find a class', 'Book one yourself', 'rgba(14,165,233,0.12)', '#0284c7', null], ['settings', 'Settings', 'Billing, approval gates, spend limits', 'var(--neutral-bg)', '#4b5563', 'Settings'], ['log-out', 'Log out', null, 'var(--neutral-bg)', '#6b7280', null]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    title: "More"
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement(Card, {
    padding: "4px 14px",
    hoverLift: false
  }, rows.map(([icon, label, meta, bg, fg, screen], i) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: () => screen && onGo(screen),
    style: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      gap: 12,
      minHeight: 56,
      padding: '12px 0',
      background: 'transparent',
      border: 'none',
      borderTop: i ? '1px solid #f3f4f6' : 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: bg,
      color: fg,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    strokeWidth: 1.9
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, label), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, meta)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "#9ca3af"
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: '#9ca3af'
    }
  }, "Cards, subscriptions and transactions live under Settings.")));
}

/* ── Notifications ───────────────────────────────────────────────────── */
const M_NOTIF = {
  booking: ['calendar-plus', 'rgba(245,158,11,0.14)', '#b45309'],
  outcome: ['check-circle-2', 'rgba(25,147,86,0.1)', 'var(--itutor-green)'],
  payment: ['credit-card', 'rgba(239,68,68,0.1)', '#dc2626'],
  feedback: ['message-square-quote', 'rgba(168,85,247,0.12)', '#7c3aed'],
  subscription: ['repeat', 'rgba(14,165,233,0.12)', '#0284c7']
};
function MNotifications({
  onBack,
  onGo
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MSubHeader, {
    title: "Notifications",
    back: "More",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement(Card, {
    padding: "4px 14px",
    hoverLift: false
  }, window.NOTIFICATIONS.map((n, i) => {
    const [icon, bg, fg] = M_NOTIF[n.type];
    const child = n.childId ? window.childBy(n.childId) : null;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onGo(n.go),
      style: {
        display: 'flex',
        width: '100%',
        gap: 10,
        alignItems: 'flex-start',
        minHeight: 56,
        padding: '13px 0',
        background: 'transparent',
        border: 'none',
        borderTop: i ? '1px solid #f3f4f6' : 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-lg)',
        display: 'grid',
        placeItems: 'center',
        background: bg,
        color: fg,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 15,
      strokeWidth: 1.9
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, child && /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: n.unread ? 'var(--weight-bold)' : 'var(--weight-medium)',
        color: 'var(--ink)',
        lineHeight: 1.35
      }
    }, n.title)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 11,
        color: 'var(--ink-muted)',
        lineHeight: 'var(--leading-relaxed)',
        marginTop: 2
      }
    }, n.body), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 3
      }
    }, n.at)));
  }))));
}

/* ── Settings — billing lives here ───────────────────────────────────── */
function MSettings({
  onBack
}) {
  const [state, setState] = React.useState({
    c1: {
      approval: true,
      selfPay: false
    },
    c2: {
      approval: true,
      selfPay: false
    }
  });
  const set = (id, k, v) => setState(s => ({
    ...s,
    [id]: {
      ...s[id],
      [k]: v
    }
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MSubHeader, {
    title: "Settings",
    back: "More",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, "Billing"), /*#__PURE__*/React.createElement(Card, {
    padding: "14px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid #dc2626'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: "#9333EA"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Aaliyah \xB7 Maths Intensive")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: 12,
      color: '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Visa \xB7\xB7\xB7\xB7 4242 declined for ", window.money(250), ". She is ", /*#__PURE__*/React.createElement("strong", null, "not enrolled"), " and the place is open to others."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    style: {
      minHeight: 44
    }
  }, "Retry payment")), /*#__PURE__*/React.createElement(Card, {
    padding: "4px 14px",
    hoverLift: false
  }, [['Visa ···· 4242', 'Expires 09/2026 · in 12 days', true], ['Mastercard ···· 8891', 'Expires 04/2029', false]].map(([label, meta, warn], i) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minHeight: 56,
      padding: '12px 0',
      borderTop: i ? '1px solid #f3f4f6' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--neutral-bg)',
      color: '#4b5563',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "credit-card",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: warn ? '#c2410c' : 'var(--ink-muted)'
    }
  }, meta)), warn && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      minHeight: 44
    }
  }, "Update")))), /*#__PURE__*/React.createElement(Card, {
    padding: "4px 14px",
    hoverLift: false
  }, window.TRANSACTIONS.slice(0, 4).map((t, i) => {
    const c = window.childBy(t.childId);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 0',
        borderTop: i ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#374151',
        lineHeight: 1.35
      }
    }, t.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#9ca3af'
      }
    }, t.date, " \xB7 ", c.short)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.money(t.amount)), /*#__PURE__*/React.createElement(Badge, {
      tone: t.status === 'Paid' ? 'success' : t.status === 'Failed' ? 'danger' : 'neutral'
    }, t.status));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, "Per child"), window.CHILDREN.map(c => {
    const s = state[c.id];
    return /*#__PURE__*/React.createElement(Card, {
      key: c.id,
      padding: "14px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + c.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, c.short)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, "Approval required"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: 11,
        color: 'var(--ink-muted)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Including free classes \u2014 you are agreeing to the enrolment.")), /*#__PURE__*/React.createElement(window.MToggle, {
      on: s.approval,
      onToggle: () => set(c.id, 'approval', !s.approval)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0 0',
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, "Let ", c.short, " pay for their own classes"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: 11,
        color: 'var(--ink-muted)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Takes effect immediately. A security email goes to you, and changing your password puts it back.")), /*#__PURE__*/React.createElement(window.MToggle, {
      on: s.selfPay,
      onToggle: () => set(c.id, 'selfPay', !s.selfPay)
    })));
  })));
}
function MToggle({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      width: 46,
      height: 28,
      borderRadius: 9999,
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      background: on ? 'var(--itutor-green)' : '#e5e7eb',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 21 : 3,
      width: 22,
      height: 22,
      borderRadius: 9999,
      background: '#fff',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  }));
}

/* ── Checkout states ─────────────────────────────────────────────────── */
function MCheckout({
  state,
  onBack,
  onGo
}) {
  const child = window.childBy('c1');
  const conf = {
    pre: ['lock', 'green', 'Approve and pay', 'You\u2019ll finish on Stripe\u2019s secure page. iTutor never sees your card details.'],
    success: ['check-circle-2', 'green', child.short + ' is enrolled', window.money(250) + ' paid. Renews 1 Oct and monthly after that — renewals won\u2019t ask again.'],
    cancelled: ['arrow-left-circle', 'neutral', 'Payment not completed', 'Nothing was charged and the request is still waiting for you.'],
    failed: ['alert-triangle', 'rose', 'Your card was declined', 'Visa ···· 4242 was declined for ' + window.money(250) + '. ' + child.short + ' is not enrolled and no place is held.'],
    taken: ['users', 'amber', 'The last place went while you were paying', 'The ' + window.money(250) + ' is being refunded automatically. There is nothing for you to do.']
  }[state] || [];
  const tint = {
    green: ['rgba(25,147,86,0.1)', 'var(--itutor-green)'],
    neutral: ['var(--neutral-bg)', '#6b7280'],
    rose: ['rgba(239,68,68,0.1)', '#dc2626'],
    amber: ['rgba(245,158,11,0.14)', '#b45309']
  }[conf[1]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MSubHeader, {
    title: "Checkout",
    back: "Back",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(MBody, null, /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: tint[0],
      color: tint[1]
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: conf[0],
    size: 20,
    strokeWidth: 1.9
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      margin: '14px 0 8px',
      lineHeight: 1.25
    }
  }, conf[2]), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, conf[3]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginTop: 18
    }
  }, state === 'pre' && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    style: {
      minHeight: 48
    },
    onClick: () => onGo('Checkout', 'success')
  }, "Continue to Stripe"), state === 'failed' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    style: {
      minHeight: 48
    },
    onClick: () => onGo('Checkout', 'success')
  }, "Retry payment"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    style: {
      minHeight: 44
    },
    onClick: () => onGo('Settings')
  }, "Update card")), state === 'cancelled' && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    style: {
      minHeight: 48
    },
    onClick: () => onGo('Checkout', 'pre')
  }, "Try again"), (state === 'success' || state === 'taken') && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    style: {
      minHeight: 44
    },
    onClick: () => onGo('Dashboard')
  }, "Back to dashboard")))));
}
Object.assign(window, {
  MDashboard,
  MApprovals,
  MChild,
  MFeedback,
  MThreads,
  MTutor,
  MCalendar,
  MMore,
  MNotifications,
  MSettings,
  MCheckout,
  MTabBar,
  MHeader,
  MSubHeader,
  MBody,
  MToggle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentMobile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentPhase1.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  StarRating,
  SubjectPill,
  Input,
  VerifiedBadge,
  ProgressBar
} = window.ITutorDesignSystem_e4581d;

/* ── shared bits ─────────────────────────────────────────────────────── */
function Dot({
  color,
  size = 8
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '9999px',
      background: color,
      flexShrink: 0,
      display: 'inline-block'
    }
  });
}
function PageTitle({
  children,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, children), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, sub)), right);
}
function IconTile({
  name,
  bg,
  fg,
  size = 36
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: bg,
      color: fg,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: size > 32 ? 18 : 14,
    strokeWidth: 1.8
  }));
}

/* Both urgency facts, stated together. A parent who assumes the seat is held and
   loses it reads that as a bug, so no surface touching a pending request omits
   either half of this. */
function SeatNotice({
  closesAt,
  compact
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      padding: compact ? 0 : '10px 12px',
      background: compact ? 'transparent' : '#fffbeb',
      border: compact ? 'none' : '1px solid #fde68a',
      borderRadius: compact ? 0 : 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 14,
    color: "#b45309",
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#78350f'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "This spot is not reserved."), " Another student can take the last place while this sits here. The request closes ", closesAt, ", two hours before the class starts."));
}
function ChildCard({
  child,
  onOpen
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    style: {
      borderLeft: '4px solid ' + child.color
    },
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: child.name,
    size: 40,
    hue: child.color === '#9333EA' ? 300 : 250
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: child.color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, child.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, child.form)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "#9ca3af"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar-days",
    bg: "rgba(14,165,233,0.12)",
    fg: "#0284c7",
    size: 28
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, child.next.subject), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, child.next.when, " \xB7 ", child.next.tutor))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      paddingTop: 10,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      lineHeight: 1
    }
  }, child.sessionsThisWeek), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "classes this week")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      color: child.color,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, window.ATTENDANCE_SUMMARY[child.id].turnUp, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "of ", window.ATTENDANCE_SUMMARY[child.id].counted, " sessions attended"))), child.lastFeedback ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#4b5563'
    }
  }, "\u201C", child.lastFeedback, "\u201D ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9ca3af'
    }
  }, "\xB7 ", child.lastFeedbackAt)) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, "No feedback yet. You can request it once a month.")));
}

/* ── Page 1 — Dashboard ──────────────────────────────────────────────── */
function AttentionRow({
  children,
  tone = 'amber'
}) {
  const bg = {
    amber: '#fffbeb',
    rose: '#fef2f2',
    purple: '#faf5ff'
  }[tone];
  const bd = {
    amber: '#fde68a',
    rose: '#fecaca',
    purple: '#e9d5ff'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      border: '1px solid ' + bd,
      borderRadius: 'var(--radius-lg)',
      padding: 16
    }
  }, children);
}
function LinkChildRow() {
  const [email, setEmail] = React.useState('');
  const [invited, setInvited] = React.useState(null);
  return /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "user-plus",
    bg: "rgba(147,51,234,0.12)",
    fg: "#7c3aed",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Link another child"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, invited ? 'Invite sent to ' + invited + '. They appear here once they accept.' : 'Enter their iTutor email and we\u2019ll send a secure link.')), /*#__PURE__*/React.createElement(Input, {
    placeholder: "child@example.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    style: {
      width: 260
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      if (email.trim()) {
        setInvited(email);
        setEmail('');
      }
    }
  }, "Send invite")));
}
function Dashboard({
  requests,
  onApprove,
  onDecline,
  onGo,
  onLink,
  children: kids
}) {
  /* Exactly three things belong in the attention card: pending requests, payment
     failures and newly filed feedback. Parents get no reminders and no digest, so
     surfacing either here would imply a channel that does not exist. */
  const newFeedback = window.FEEDBACK.filter(f => f.id === 'f1');
  const failures = window.TRANSACTIONS.filter(t => t.status === 'Failed');
  const count = requests.length + failures.length + newFeedback.length;
  if (!kids || kids.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 20,
        maxWidth: 1080
      }
    }, /*#__PURE__*/React.createElement(PageTitle, {
      sub: "One step before anything else: link your child\\u2019s account."
    }, "Welcome to iTutor"), /*#__PURE__*/React.createElement(EmptyChildren, {
      onLink: onLink
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 24,
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "Two children, five classes this week.",
    right: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => onGo('Booking'),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 14,
        color: "#fff"
      })
    }, "Find a class")
  }, "Family dashboard"), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: count ? 18 : 0
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "bell-ring",
    bg: "rgba(245,158,11,0.14)",
    fg: "#b45309",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "What needs your attention"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, count ? count + (count === 1 ? ' item' : ' items') : 'Nothing waiting on you.'))), !count ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '18px 0 4px'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar-check",
    bg: "rgba(25,147,86,0.1)",
    fg: "var(--itutor-green)",
    size: 36
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#374151'
    }
  }, "Nothing needs you. Aaliyah\u2019s next class is ", /*#__PURE__*/React.createElement("strong", null, "today at 4:00 PM"), " \u2014 CSEC Mathematics with Anisa Mohammed.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, requests.map(r => {
    const child = window.childBy(r.childId);
    const free = r.priceWhenRequested === 0;
    return /*#__PURE__*/React.createElement(AttentionRow, {
      key: r.id,
      tone: "amber"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 260
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        color: '#4b5563'
      }
    }, child.short, " wants to join"), /*#__PURE__*/React.createElement(Badge, {
      tone: "amber",
      shape: "rect",
      uppercase: true
    }, "Needs approval")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, r.subject), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)',
        marginTop: 2
      }
    }, r.tutor, " \xB7 ", free ? 'Free class' : window.money(r.priceWhenRequested), " \xB7 closes ", r.closesAt)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => onApprove(r.id)
    }, free ? 'Approve' : 'Approve & pay'), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => onDecline(r.id)
    }, "Decline"))));
  }), failures.map(t => {
    const child = window.childBy(t.childId);
    return /*#__PURE__*/React.createElement(AttentionRow, {
      key: t.id,
      tone: "rose"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 260
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        color: '#4b5563'
      }
    }, child.short, " \xB7 ", t.desc.split(' — ')[0]), /*#__PURE__*/React.createElement(Badge, {
      tone: "danger",
      shape: "rect",
      uppercase: true
    }, "Payment failed")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: '#374151',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Visa \xB7\xB7\xB7\xB7 4242 was declined on ", t.date, ". ", child.short, " is ", /*#__PURE__*/React.createElement("strong", null, "not enrolled"), " and the place is open to other students until this goes through.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => onGo('Checkout', 'failed')
    }, "Retry payment"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => onGo('Settings')
    }, "Update card"))));
  }), newFeedback.map(f => {
    const child = window.childBy(f.childId);
    return /*#__PURE__*/React.createElement(AttentionRow, {
      key: f.id,
      tone: "purple"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 260,
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: '#374151'
      }
    }, /*#__PURE__*/React.createElement("strong", null, f.tutor, " filed feedback"), " for ", child.short, " \u2014 ", f.subject, ", ", f.date, ".")), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => onGo('FeedbackDetail', f.id)
    }, "Read feedback")));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      marginBottom: 12
    }
  }, "Your children"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 16
    }
  }, kids.map(c => /*#__PURE__*/React.createElement(ChildCard, {
    key: c.id,
    child: c,
    onOpen: () => onGo('Child', c.id)
  })))), /*#__PURE__*/React.createElement(LinkChildRow, null), /*#__PURE__*/React.createElement(ActivityFeed, null));
}
function ActivityFeed() {
  const [open, setOpen] = React.useState(false);
  const items = [{
    icon: 'credit-card',
    tone: ['rgba(239,68,68,0.1)', '#dc2626'],
    childId: 'c1',
    text: 'Payment failed — Maths Intensive, $250 TTD',
    at: '1 Sep, 6:02 AM'
  }, {
    icon: 'file-text',
    tone: ['rgba(168,85,247,0.12)', '#7c3aed'],
    childId: 'c1',
    text: 'Feedback filed by Anisa Mohammed',
    at: '30 Aug, 9:14 AM'
  }, {
    icon: 'calendar-plus',
    tone: ['rgba(245,158,11,0.14)', '#b45309'],
    childId: 'c2',
    text: 'Class requested — CAPE Chemistry lab prep',
    at: '28 Aug, 8:15 PM'
  }, {
    icon: 'check-circle-2',
    tone: ['rgba(25,147,86,0.1)', 'var(--itutor-green)'],
    childId: 'c1',
    text: 'Request approved and paid — $189 TTD',
    at: '28 Aug, 7:42 PM'
  }, {
    icon: 'clock',
    tone: ['var(--neutral-bg)', '#6b7280'],
    childId: 'c2',
    text: 'Request expired — CAPE Chemistry, Organic revision',
    at: '21 Aug, 3:00 PM'
  }];
  return /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "history",
    bg: "var(--neutral-bg)",
    fg: "#6b7280",
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Recent activity"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "requests, payments and feedback")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9ca3af',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'grid'
    }
  }, items.map((it, i) => {
    const child = window.childBy(it.childId);
    return /*#__PURE__*/React.createElement("div", {
      key: it.text,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderTop: i ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React.createElement(IconTile, {
      name: it.icon,
      bg: it.tone[0],
      fg: it.tone[1],
      size: 32
    }), /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: '#374151'
      }
    }, it.text), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#9ca3af'
      }
    }, it.at));
  })));
}
function EmptyChildren({
  onLink
}) {
  const steps = ['Ask your child to create an iTutor account', 'Enter their email below', 'We’ll send them a secure link', 'They appear here once they accept'];
  return /*#__PURE__*/React.createElement(Card, {
    padding: "32px",
    hoverLift: false,
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "users",
    bg: "rgba(147,51,234,0.12)",
    fg: "#7c3aed",
    size: 44
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      margin: '16px 0 6px'
    }
  }, "Link your first child"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, "Once linked, their classes, attendance and spend appear here \u2014 and their class requests come to you for approval."), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: '0 0 20px',
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 10
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      fontSize: 'var(--text-sm)',
      color: '#374151'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '9999px',
      background: 'var(--neutral-bg)',
      color: '#4b5563',
      fontSize: 11,
      fontWeight: 'var(--weight-bold)',
      display: 'grid',
      placeItems: 'center'
    }
  }, i + 1), s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Your child\u2019s email",
    placeholder: "child@example.com",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onLink
  }, "Send invite")));
}

/* ── Page 2 — Approval queue ─────────────────────────────────────────── */
function Approvals({
  requests,
  decided,
  onApprove,
  onDecline,
  onTutor
}) {
  const [declining, setDeclining] = React.useState(null);
  const [reason, setReason] = React.useState('');
  const [histOpen, setHistOpen] = React.useState(true);
  const outcomeTone = {
    Approved: 'success',
    Declined: 'neutral',
    Expired: 'amber'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 840
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "No place is held while you decide. Each request closes two hours before its class starts.",
    right: requests.length ? /*#__PURE__*/React.createElement(Badge, {
      tone: "amber"
    }, requests.length, " pending") : null
  }, "Booking requests"), requests.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    padding: "32px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "check-circle-2",
    bg: "rgba(25,147,86,0.1)",
    fg: "var(--itutor-green)",
    size: 40
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '14px 0 14px',
      fontSize: 'var(--text-sm)',
      color: '#374151'
    }
  }, "No pending requests. When Aaliyah or Josiah asks to join a class, it comes here first."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => window.dispatchEvent(new CustomEvent('parent-go', {
      detail: 'Booking'
    }))
  }, "Book a class yourself")) : requests.map(r => {
    const child = window.childBy(r.childId);
    const free = r.priceWhenRequested === 0;
    return /*#__PURE__*/React.createElement(Card, {
      key: r.id,
      padding: "24px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + child.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color,
      size: 10
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, child.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#9ca3af'
      }
    }, "requested ", r.requested)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        color: '#b45309'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14
    }), " Closes ", r.closesAt)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-h4)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)',
        letterSpacing: 0,
        marginBottom: 10
      }
    }, r.subject), /*#__PURE__*/React.createElement("button", {
      onClick: onTutor,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.tutor,
      size: 32,
      hue: 150
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, r.tutor, " ", /*#__PURE__*/React.createElement(VerifiedBadge, {
      size: 14
    }), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 'var(--weight-medium)',
        color: 'var(--itutor-green)'
      }
    }, "View profile \u2192")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, r.when, " \xB7 ", r.minutes, " min"))), /*#__PURE__*/React.createElement(SeatNotice, {
      closesAt: r.closesAt
    })), /*#__PURE__*/React.createElement(Card, {
      variant: "inset",
      padding: "14px",
      hoverLift: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 'var(--weight-semibold)',
        color: '#6b7280',
        marginBottom: 6
      }
    }, "Price as listed when requested"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.1
      }
    }, free ? 'Free' : window.money(r.priceWhenRequested)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontSize: 11,
        lineHeight: 'var(--leading-relaxed)',
        color: '#6b7280'
      }
    }, free ? 'No payment is involved. You are approving the enrolment itself.' : 'This is the price on ' + r.requested.replace('ago', 'ago').toLowerCase() + '. The tutor\u2019s current price may differ.'), !free && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--text-xs)',
        color: '#6b7280'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 14
    }), " Paid on Stripe"))), declining === r.id ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Reason (optional \u2014 sent to your child word for word)",
      placeholder: "Clashes with football practice \u2014 try Saturdays.",
      value: reason,
      onChange: e => setReason(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => {
        onDecline(r.id, reason);
        setDeclining(null);
        setReason('');
      }
    }, "Send decline"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => setDeclining(null)
    }, "Keep pending"))) : /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => onApprove(r.id),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16,
        color: "#fff"
      })
    }, free ? 'Approve enrolment' : 'Approve & pay ' + window.money(r.priceWhenRequested)), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setDeclining(r.id)
    }, "Decline"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#9ca3af'
      }
    }, free ? 'Confirms on the spot — no payment page.' : 'Continues to Stripe.')));
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setHistOpen(o => !o),
    style: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Past decisions"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "approved, declined and expired")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9ca3af',
      transform: histOpen ? 'rotate(180deg)' : 'none',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16
  }))), histOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, decided.map((d, i) => {
    const child = window.childBy(d.childId);
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        padding: '12px 0',
        borderTop: i ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: '#374151'
      }
    }, child.short, " \xB7 ", d.subject, " \xB7 ", d.tutor), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#9ca3af'
      }
    }, d.at), /*#__PURE__*/React.createElement(Badge, {
      tone: outcomeTone[d.decision]
    }, d.decision)), d.reason && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0 18px',
        fontSize: 'var(--text-xs)',
        color: '#6b7280'
      }
    }, "Reason sent: \u201C", d.reason, "\u201D"), d.note && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0 18px',
        fontSize: 'var(--text-xs)',
        color: '#6b7280'
      }
    }, d.note));
  }))));
}

/* ── Tutor profile (parent-facing) ───────────────────────────────────── */
function TutorProfile({
  onBack,
  onMessage
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 880
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Back"), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: "../../assets/team/liam-rampersad.jpg",
    name: "Anisa Mohammed",
    size: 72,
    rounded: "2xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "Anisa Mohammed"), /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 20
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 10px',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, "CSEC & CAPE Mathematics \xB7 Chaguanas \xB7 Teaching since 2015"), /*#__PURE__*/React.createElement(StarRating, {
    value: 4.9,
    count: 42
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 14
    }
  }, ['CSEC Mathematics', 'Add Maths', 'CAPE Pure Maths', 'Physics'].map(s => /*#__PURE__*/React.createElement(SubjectPill, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
      padding: '8px 12px',
      background: 'rgba(25,147,86,0.08)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge-check",
    size: 16,
    color: "var(--itutor-green)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#166534'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Verified iTutor"), " \u2014 identity confirmed 12 Mar 2025"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onMessage,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-square",
      size: 14,
      color: "#fff"
    })
  }, "Message"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "View availability")))), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 12
    }
  }, "Availability"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 6
    }
  }, [['Mon', '4–8 PM'], ['Tue', '—'], ['Wed', '4–8 PM'], ['Thu', '5–7 PM'], ['Fri', '—'], ['Sat', '9 AM–1 PM'], ['Sun', '2–5 PM']].map(([d, t]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      background: t === '—' ? 'var(--neutral-bg)' : 'rgba(25,147,86,0.08)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 8px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: '#6b7280'
    }
  }, d), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: t === '—' ? '#9ca3af' : '#166534',
      marginTop: 2
    }
  }, t))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 10
    }
  }, "About & teaching style"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#4b5563'
    }
  }, "Secondary school Maths teacher for eleven years, eight of them on the CSEC syllabus. I work past paper by past paper, so students see the same question shapes over and over until the panic goes out of them.")), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 10
    }
  }, "Recent reviews"), [['Mr. Ramdeen', 'She came home with a Grade I after weeks of a 3.'], ['S. Khan', 'Patient with my son, and always on time.']].map(([who, text]) => /*#__PURE__*/React.createElement("div", {
    key: who,
    style: {
      paddingTop: 10,
      marginTop: 10,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(StarRating, {
    value: 5,
    size: 12,
    showNumber: false
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 2px',
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, "\u201C", text, "\u201D"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, who))))));
}
Object.assign(window, {
  Dot,
  PageTitle,
  IconTile,
  SeatNotice,
  ChildCard,
  Dashboard,
  EmptyChildren,
  Approvals,
  TutorProfile,
  LinkChildRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentPhase1.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentPhase2.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  StarRating,
  SubjectPill,
  Input,
  Checkbox,
  ProgressBar
} = window.ITutorDesignSystem_e4581d;
const {
  Dot,
  PageTitle,
  IconTile
} = window;

/* ── Child detail ────────────────────────────────────────────────────── */
const TABS = ['Overview', 'Progress', 'Schedule', 'Classes', 'Billing', 'Messages'];
function ChildSwitcher({
  childId,
  onSwitch
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, window.CHILDREN.map(c => {
    const on = c.id === childId;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => onSwitch(c.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        background: on ? '#fff' : 'transparent',
        border: '1px solid ' + (on ? c.color : 'var(--surface-border)'),
        color: on ? 'var(--ink)' : '#6b7280',
        boxShadow: on ? 'var(--shadow-sm)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), c.short);
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-full)',
      border: '1px dashed var(--surface-border)',
      background: 'transparent',
      color: '#9ca3af',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Link a child"));
}

/* Attendance is derived from join timestamps and cannot be edited, so nothing
   here offers a control and nothing attributes a record to a person. */
function AttendanceGrid({
  child
}) {
  const s = window.ATTENDANCE_SUMMARY[child.id];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      fontWeight: 'var(--weight-bold)',
      lineHeight: 1,
      color: s.turnUp >= 90 ? 'var(--itutor-green)' : s.turnUp >= 75 ? '#b45309' : '#dc2626',
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.turnUp, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "of ", s.counted, " sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 6,
      maxWidth: 240
    }
  }, child.history.map((st, i) => {
    const a = window.ATTENDANCE[st];
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      title: a.label,
      style: {
        height: 26,
        borderRadius: 6,
        background: a.fg,
        opacity: st === 'cancelled' ? 0.3 : st === 'attended' ? 0.5 + i / child.history.length * 0.5 : 1
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginTop: 12
    }
  }, [['attended', s.attended], ['late', s.late], ['absent', s.absent], ['cancelled', s.cancelled]].map(([k, v]) => {
    const a = window.ATTENDANCE[k];
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 'var(--text-xs)',
        color: '#4b5563'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: a.fg,
        opacity: k === 'cancelled' ? 0.35 : 1
      }
    }), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontVariantNumeric: 'tabular-nums'
      }
    }, v), " ", a.label.toLowerCase());
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Recorded automatically from when ", child.short, " joined each class. ", child.streak, "-session streak."));
}

/* One request per child per month, shared with the student. When it is spent the
   action is disabled and says plainly who spent it. */
function RequestFeedback({
  childId,
  onRequest
}) {
  const q = window.FEEDBACK_QUOTA[childId];
  const child = window.childBy(childId);
  const [asked, setAsked] = React.useState(false);
  const used = q.used || asked;
  const who = asked ? 'You requested feedback just now.' : q.usedBy === 'student' ? child.short + ' requested feedback on ' + q.usedOn + '.' : 'You requested feedback on ' + q.usedOn + '.';
  return /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "message-square-quote",
    bg: "rgba(147,51,234,0.12)",
    fg: "#7c3aed",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Request feedback"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, used ? who + ' You and ' + child.short + ' share one request a month — the next one opens in October.' : 'One request a month, shared with ' + child.short + '. The tutor answers in their own time; nothing chases them.')), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: used,
    onClick: () => {
      setAsked(true);
      onRequest && onRequest();
    }
  }, used ? 'Used this month' : 'Request feedback')));
}
function ChildDetail({
  childId,
  onSwitch,
  onOpenFeedback,
  onGo,
  tab: initialTab
}) {
  const [tab, setTab] = React.useState(initialTab || 'Overview');
  React.useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab, childId]);
  const child = window.childBy(childId);
  const items = window.FEEDBACK.filter(r => r.childId === childId);
  const tx = window.TRANSACTIONS.filter(t => t.childId === childId);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: child.name,
    size: 44,
    hue: child.color === '#9333EA' ? 300 : 250
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: child.color,
    size: 10
  }), child.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, child.form, " \xB7 linked since ", child.linkedOn))), /*#__PURE__*/React.createElement(ChildSwitcher, {
    childId: childId,
    onSwitch: onSwitch
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border)'
    }
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: '10px 14px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: tab === t ? 'var(--ink)' : '#9ca3af',
      borderBottom: '2px solid ' + (tab === t ? child.color : 'transparent'),
      marginBottom: -1
    }
  }, t))), tab === 'Overview' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid ' + child.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar-days",
    bg: "rgba(14,165,233,0.12)",
    fg: "#0284c7",
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--itutor-green)'
    }
  }, "Next class"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      letterSpacing: 0
    }
  }, child.next.subject), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, child.next.when, " \xB7 ", child.next.tutor)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 14
    }
  }, "Attendance"), /*#__PURE__*/React.createElement(AttendanceGrid, {
    child: child
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 14
    }
  }, "This month"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12
    }
  }, [['Sessions ran', window.ATTENDANCE_SUMMARY[childId].counted], ['Attended', window.ATTENDANCE_SUMMARY[childId].turnUp + '%'], ['Hours', 14]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      paddingTop: 14,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 6px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: '#4b5563'
    }
  }, "Latest feedback"), child.lastFeedback ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#4b5563'
    }
  }, "\u201C", child.lastFeedback, "\u201D"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenFeedback(items[0].id),
    style: {
      marginTop: 8,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--itutor-green)'
    }
  }, "Read it in full \u2192")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#6b7280'
    }
  }, "None yet. Feedback is optional and comes when you ask for it."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('Progress'),
    style: {
      marginTop: 8,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--itutor-green)'
    }
  }, "Request feedback \u2192")))))), tab === 'Progress' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(RequestFeedback, {
    childId: childId
  }), items.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    padding: "28px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "message-square-dashed",
    bg: "var(--neutral-bg)",
    fg: "#9ca3af",
    size: 40
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '14px 0 4px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "No feedback for ", child.short, " yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#6b7280',
      maxWidth: 460,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Most classes produce none \u2014 tutors write it when there is something worth saying, or when you ask. Attendance is tracked either way, on the Schedule tab.")) : items.map(r => /*#__PURE__*/React.createElement(Card, {
    key: r.id,
    padding: "20px",
    onClick: () => onOpenFeedback(r.id),
    style: {
      borderLeft: '4px solid ' + child.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, r.subject, " \xB7 ", r.date), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: r.requestedBy ? 'progress' : 'neutral'
  }, r.requestedBy ? 'You asked' : 'Sent unprompted'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, r.tutor))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: '#6b7280'
    }
  }, "Covering ", r.covering, " \xB7 participation: ", r.participation.toLowerCase()), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, r.freeText[0].body))), items.length === 1 && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, "That is everything on file. Gaps of a month or more are normal.")), tab === 'Schedule' && /*#__PURE__*/React.createElement(ScheduleTab, {
    child: child
  }), tab === 'Classes' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, [{
    name: 'CSEC Mathematics 1:1',
    tutor: 'Anisa Mohammed',
    pattern: 'Tuesdays & Saturdays',
    next: 'Today · 4:00 PM',
    status: 'Active',
    tone: 'success'
  }, {
    name: 'Maths Intensive — Paper 2 Drills (group)',
    tutor: 'Anisa Mohammed',
    pattern: 'Saturdays, 10:00 AM',
    next: 'Sat 6 Sep',
    status: 'Payment failed',
    tone: 'danger'
  }, {
    name: 'Physics — SBA help',
    tutor: 'Marcus Alleyne',
    pattern: 'Ad hoc',
    next: '—',
    status: 'Completed',
    tone: 'neutral'
  }].map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.name,
    padding: "18px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "book-open",
    bg: "rgba(147,51,234,0.12)",
    fg: "#7c3aed",
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, c.tutor, " \xB7 ", c.pattern)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#4b5563',
      minWidth: 110
    }
  }, "Next: ", c.next), /*#__PURE__*/React.createElement(Badge, {
    tone: c.tone
  }, c.status))))), tab === 'Billing' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, [['Sessions this month', 11], ['Spent this month', window.money(756)], ['Average per session', window.money(69)]].map(([l, v]) => /*#__PURE__*/React.createElement(Card, {
    key: l,
    padding: "20px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid ' + child.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      lineHeight: 1.1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)',
      marginTop: 4
    }
  }, l)))), /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 8
    }
  }, "Transactions for ", child.short), tx.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderTop: i ? '1px solid #f3f4f6' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#9ca3af',
      width: 96
    }
  }, t.date), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-sm)',
      color: '#374151'
    }
  }, t.desc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, window.money(t.amount)), /*#__PURE__*/React.createElement(Badge, {
    tone: t.status === 'Paid' ? 'success' : t.status === 'Failed' ? 'danger' : 'neutral'
  }, t.status))))), tab === 'Messages' && /*#__PURE__*/React.createElement(ChildMessages, {
    child: child
  }));
}

/* ── Child's message history — read-only ─────────────────────────────── */
/* No composer, no reply affordance. Disclosure runs both ways: the parent is told
   the child knows, and the child carries a matching persistent notice. */
function ChildMessages({
  child
}) {
  const t = window.CHILD_THREADS[child.id];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'rgba(14,165,233,0.08)',
      border: '1px solid rgba(14,165,233,0.25)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "eye",
    size: 16,
    color: "#0369a1"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#0c4a6e'
    }
  }, child.short, " can see that you have access to this conversation."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#075985',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "You are reading it, not taking part in it. Messages from ", t.from, " onward \u2014 anything before you were linked stays private."))), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 16,
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.tutor,
    size: 36,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, child.short, " & ", t.tutor), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, t.subject)), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect",
    uppercase: true
  }, "Read only")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'grid',
      gap: 12,
      background: 'var(--surface-inset)'
    }
  }, t.messages.map((m, i) => {
    const fromChild = m.from === 'student';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: fromChild ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '72%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        background: fromChild ? 'color-mix(in oklab, ' + child.color + ' 14%, #fff)' : '#fff',
        border: '1px solid ' + (fromChild ? 'color-mix(in oklab, ' + child.color + ' 30%, #fff)' : '#e5e7eb'),
        color: '#374151',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: '#9ca3af',
        textAlign: fromChild ? 'right' : 'left'
      }
    }, fromChild ? child.short : t.tutor, " \xB7 ", m.at)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderTop: '1px solid #f3f4f6',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14,
    color: "#9ca3af"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, "You cannot reply here. To speak to ", t.tutor, ", use your own thread under Feedback."))));
}
function ScheduleTab({
  child
}) {
  const [view, setView] = React.useState('Week');
  const days = ['Mon 1', 'Tue 2', 'Wed 3', 'Thu 4', 'Fri 5', 'Sat 6', 'Sun 7'];
  const events = window.SESSION_EVENTS.filter(e => e.childId === child.id);
  return /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "September 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, ['Week', 'Month'].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setView(v),
    style: {
      padding: '6px 14px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      background: view === v ? 'var(--neutral-bg)' : '#fff',
      color: view === v ? 'var(--ink)' : '#6b7280'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 12
    }
  }, ['attended', 'late', 'absent', 'cancelled'].map(k => {
    const a = window.ATTENDANCE[k];
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: '#4b5563'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: a.fg,
        opacity: k === 'cancelled' ? 0.35 : 1
      }
    }), a.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 8
    }
  }, days.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      minHeight: view === 'Week' ? 150 : 90,
      border: '1px solid #f3f4f6',
      borderRadius: 'var(--radius-md)',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: '#9ca3af',
      marginBottom: 6
    }
  }, d), events.filter(e => e.day === i).map(e => {
    const a = e.attendance ? window.ATTENDANCE[e.attendance] : null;
    return /*#__PURE__*/React.createElement("div", {
      key: e.subject + e.time,
      style: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 6,
        background: a ? a.bg : 'color-mix(in oklab, ' + child.color + ' 12%, #fff)',
        borderLeft: '3px solid ' + (a ? a.fg : child.color)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, e.time), a && /*#__PURE__*/React.createElement("span", {
      title: a.label,
      style: {
        marginLeft: 'auto',
        width: 14,
        height: 14,
        borderRadius: 9999,
        display: 'grid',
        placeItems: 'center',
        background: a.fg,
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 9,
      strokeWidth: 3
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#4b5563',
        lineHeight: 1.35
      }
    }, e.subject), a && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontSize: 10,
        fontWeight: 'var(--weight-semibold)',
        color: a.fg
      }
    }, a.label, e.lateBy ? ' · ' + e.lateBy + ' min' : ''));
  })))));
}

/* ── Feedback detail ─────────────────────────────────────────────────── */
function FeedbackDetail({
  feedbackId,
  onBack
}) {
  const r = window.feedbackBy(feedbackId) || window.FEEDBACK[0];
  const child = window.childBy(r.childId);
  const s = window.ATTENDANCE_SUMMARY[r.childId];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Back to ", child.short), /*#__PURE__*/React.createElement(Card, {
    padding: "28px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid ' + child.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingBottom: 18,
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.tutor,
    size: 44,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: child.color,
    size: 10
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, child.short, " \xB7 ", r.subject)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, "Filed ", r.date, " by ", r.tutor, " \xB7 covering ", r.covering))), r.requestedBy && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      marginTop: 18,
      padding: '12px 14px',
      background: 'rgba(147,51,234,0.07)',
      border: '1px solid rgba(147,51,234,0.2)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square-quote",
    size: 16,
    color: "#7c3aed"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#5b21b6',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Answering a request ", r.requestedBy === 'parent' ? 'you' : child.short + '', " made on ", r.requestedOn, ".")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 18,
      paddingTop: 18,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#6b7280'
    }
  }, "Attendance"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect"
  }, "Automatic \xB7 not editable")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      padding: 16,
      background: 'var(--surface-inset)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: 'var(--ink)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.turnUp, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "of ", s.counted, " sessions")), [['attended', s.attended], ['late', s.late], ['absent', s.absent]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: window.ATTENDANCE[k].fg,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, window.ATTENDANCE[k].label.toLowerCase())))), r.attendanceNote && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#374151'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9ca3af'
    }
  }, "Tutor\u2019s note: "), r.attendanceNote)), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 18,
      paddingTop: 18,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#6b7280'
    }
  }, "Did ", child.short, " participate?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, window.PARTICIPATION_OPTIONS.map(o => {
    const on = o === r.participation;
    return /*#__PURE__*/React.createElement("div", {
      key: o,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        background: on ? 'rgba(25,147,86,0.07)' : 'transparent',
        border: '1px solid ' + (on ? 'rgba(25,147,86,0.35)' : '#f3f4f6')
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 9999,
        border: '2px solid ' + (on ? 'var(--itutor-green)' : '#d1d5db'),
        display: 'grid',
        placeItems: 'center'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: 'var(--itutor-green)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)',
        color: on ? 'var(--ink)' : '#6b7280'
      }
    }, o));
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 18,
      paddingTop: 18,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#6b7280'
    }
  }, "Written feedback"), /*#__PURE__*/React.createElement(Badge, {
    tone: "amber",
    shape: "rect",
    uppercase: true
  }, "TODO \xA77.1")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 11,
      color: '#9ca3af',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Which free-text sections survive \u2014 performance, behaviour, focus next \u2014 and whether a star rating stays, is undecided. Rendered from whatever sections the template carries."), r.freeText.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.key,
    style: {
      padding: '12px 0',
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 3px',
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, f.label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#374151'
    }
  }, f.body)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, "Sent to you and to ", child.short, ".")));
}

/* ── Notifications & preferences ─────────────────────────────────────── */
const NOTIF_ICONS = {
  booking: ['calendar-plus', 'rgba(245,158,11,0.14)', '#b45309'],
  outcome: ['check-circle-2', 'rgba(25,147,86,0.1)', 'var(--itutor-green)'],
  payment: ['credit-card', 'rgba(239,68,68,0.1)', '#dc2626'],
  feedback: ['message-square-quote', 'rgba(168,85,247,0.12)', '#7c3aed'],
  subscription: ['repeat', 'rgba(14,165,233,0.12)', '#0284c7']
};
function Notifications({
  onGo
}) {
  const cats = window.NOTIFICATION_CATEGORIES;
  const [prefs, setPrefs] = React.useState(() => {
    const o = {};
    cats.forEach(c => {
      o[c.key] = {
        push: true,
        email: c.key !== 'subscription'
      };
    });
    return o;
  });
  const [perChild, setPerChild] = React.useState(false);
  const toggle = (key, ch) => setPrefs(p => ({
    ...p,
    [key]: {
      ...p[key],
      [ch]: !p[key][ch]
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "What we told you, and what you want to hear about."
  }, "Notifications"), /*#__PURE__*/React.createElement(Card, {
    padding: "8px 20px",
    hoverLift: false
  }, window.NOTIFICATIONS.map((n, i) => {
    const [icon, bg, fg] = NOTIF_ICONS[n.type];
    const child = n.childId ? window.childBy(n.childId) : null;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onGo(n.go),
      style: {
        display: 'flex',
        width: '100%',
        gap: 12,
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: '14px 0',
        background: 'transparent',
        border: 'none',
        borderTop: i ? '1px solid #f3f4f6' : 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(IconTile, {
      name: icon,
      bg: bg,
      fg: fg,
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, child && /*#__PURE__*/React.createElement(Dot, {
      color: child.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: n.unread ? 'var(--weight-bold)' : 'var(--weight-medium)',
        color: 'var(--ink)'
      }
    }, n.title), n.unread && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 9999,
        background: 'var(--brand)'
      }
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, n.body)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#9ca3af',
        whiteSpace: 'nowrap'
      }
    }, n.at));
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 4
    }
  }, "Preferences"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Two children means twice the notifications. Turn off what you don\u2019t need \u2014 everything stays visible in this list either way."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 80px 80px',
      gap: 0,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null), ['Push', 'Email'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#9ca3af',
      textAlign: 'center'
    }
  }, c)), cats.map(row => /*#__PURE__*/React.createElement(React.Fragment, {
    key: row.key
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '12px 0',
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      color: '#374151'
    }
  }, row.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      color: '#9ca3af'
    }
  }, row.detail)), ['push', 'email'].map(ch => /*#__PURE__*/React.createElement("span", {
    key: ch,
    style: {
      padding: '12px 0',
      borderTop: '1px solid #f3f4f6',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(row.key, ch),
    "aria-label": row.label + ' ' + ch,
    style: {
      width: 40,
      height: 22,
      borderRadius: 9999,
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      background: prefs[row.key][ch] ? 'var(--itutor-green)' : '#e5e7eb',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: prefs[row.key][ch] ? 21 : 3,
      width: 16,
      height: 16,
      borderRadius: 9999,
      background: '#fff',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  }))))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPerChild(v => !v),
    style: {
      marginTop: 16,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--itutor-green)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: perChild ? 'chevron-down' : 'chevron-right',
    size: 14
  }), " Mute per child"), perChild && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'grid',
      gap: 10
    }
  }, window.CHILDREN.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      padding: 14,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #f3f4f6',
      borderLeft: '4px solid ' + c.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: c.color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, c.short)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, cats.map(r => /*#__PURE__*/React.createElement(Checkbox, {
    key: r.key,
    id: c.id + r.key,
    label: 'Mute ' + r.label.toLowerCase()
  }))))))));
}

/* ── Feedback threads — the parent's own conversation ────────────────── */
function ThreadFeedbackCard({
  feedbackId,
  onOpen
}) {
  const f = window.feedbackBy(feedbackId);
  const child = window.childBy(f.childId);
  const s = window.ATTENDANCE_SUMMARY[f.childId];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(124,58,237,0.2)',
      borderLeft: '4px solid #7c3aed',
      borderRadius: 'var(--radius-lg)',
      background: '#fff',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      background: 'rgba(147,51,234,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: '#fff',
      color: '#7c3aed',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square-quote",
    size: 15,
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "progress",
    shape: "rect",
    uppercase: true
  }, "Feedback"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: '#4b5563'
    }
  }, f.date), f.requestedBy && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#7c3aed'
    }
  }, "answering your request of ", f.requestedOn)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, f.subject, " \xB7 ", f.covering))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      paddingBottom: 12,
      borderBottom: '1px solid #f3f4f6',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, /*#__PURE__*/React.createElement("strong", null, s.turnUp, "%"), " of ", s.counted, " sessions"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, "Participation: ", /*#__PURE__*/React.createElement("strong", null, f.participation))), f.freeText.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.key,
    style: {
      padding: '10px 0',
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 3px',
      fontSize: 10,
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: '#9ca3af'
    }
  }, x.label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#374151'
    }
  }, x.body))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen(f.id),
    style: {
      marginTop: 10,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--itutor-green)'
    }
  }, "Open full feedback \u2192")));
}
function Messages({
  onTutor,
  onOpenFeedback
}) {
  const [openId, setOpenId] = React.useState(window.THREADS[0].id);
  const [filter, setFilter] = React.useState('All');
  const [draft, setDraft] = React.useState('');
  const [sent, setSent] = React.useState([]);
  const thread = window.THREADS.find(t => t.id === openId);
  const child = window.childBy(thread.childId);
  const filters = ['All', 'Feedback only', 'Replies'];
  const shown = thread.messages.concat(sent.filter(s => s.threadId === openId)).filter(m => filter === 'All' || (filter === 'Feedback only' ? m.kind === 'feedback' : m.kind === 'chat'));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "Your own conversation with each tutor. Feedback arrives when you request it and the tutor gets to it \u2014 long gaps are normal."
  }, "Feedback & messages"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "8px",
    hoverLift: false
  }, window.THREADS.map(t => {
    const c = window.childBy(t.childId);
    const on = t.id === openId;
    const hasFeedback = t.messages.some(m => m.kind === 'feedback');
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setOpenId(t.id),
      style: {
        display: 'flex',
        width: '100%',
        gap: 10,
        textAlign: 'left',
        padding: 12,
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        cursor: 'pointer',
        background: on ? 'var(--surface-inset)' : 'transparent',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: t.avatar,
      name: t.tutor,
      size: 36,
      hue: 150
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, t.tutor), t.unread > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, /*#__PURE__*/React.createElement(window.CountDot, {
      n: t.unread
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        margin: '3px 0'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#6b7280'
      }
    }, c.short, " \xB7 ", t.subject)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 7px',
        borderRadius: 'var(--radius-sm)',
        background: hasFeedback ? 'rgba(147,51,234,0.1)' : 'var(--neutral-bg)',
        color: hasFeedback ? '#7c3aed' : '#9ca3af',
        fontSize: 10,
        fontWeight: 'var(--weight-bold)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: hasFeedback ? 'message-square-quote' : 'minus',
      size: 10
    }), hasFeedback ? 'Feedback · ' + window.feedbackBy(t.messages.filter(m => m.kind === 'feedback').slice(-1)[0].feedbackId).date : 'No feedback yet'), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        fontSize: 11,
        color: 'var(--ink-muted)',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, t.last)));
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false,
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: 620
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 16,
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: thread.avatar,
    name: thread.tutor,
    size: 36,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, thread.tutor), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: child.color
  }), " ", child.short, " \xB7 ", thread.subject)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, filters.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    style: {
      padding: '6px 12px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      background: filter === f ? 'var(--neutral-bg)' : '#fff',
      color: filter === f ? 'var(--ink)' : '#6b7280'
    }
  }, f))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onTutor
  }, "Profile")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'grid',
      gap: 12,
      alignContent: 'start',
      background: 'var(--surface-inset)'
    }
  }, shown.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 4px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#4b5563'
    }
  }, filter === 'All' ? 'Nothing here yet' : 'Nothing in this filter'), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, filter === 'Feedback only' ? 'No feedback from ' + thread.tutor + ' so far. You can request it from ' + child.short + '\u2019s Progress tab.' : 'Send ' + thread.tutor + ' a message below.')), shown.map((m, i) => {
    if (m.kind === 'feedback') {
      return /*#__PURE__*/React.createElement("div", {
        key: i
      }, /*#__PURE__*/React.createElement(ThreadFeedbackCard, {
        feedbackId: m.feedbackId,
        onOpen: onOpenFeedback
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 4,
          fontSize: 10,
          color: '#9ca3af'
        }
      }, m.at));
    }
    const mine = m.from === 'parent';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '72%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        background: mine ? 'var(--itutor-green)' : '#fff',
        color: mine ? '#fff' : '#374151',
        border: mine ? 'none' : '1px solid #e5e7eb',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: '#9ca3af',
        textAlign: mine ? 'right' : 'left'
      }
    }, m.at, mine ? ' · Read' : '')));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 12,
      borderTop: '1px solid #f3f4f6',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: 'Reply to ' + thread.tutor + '…',
    value: draft,
    onChange: e => setDraft(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      if (draft.trim()) {
        setSent(s => s.concat({
          threadId: openId,
          kind: 'chat',
          from: 'parent',
          text: draft,
          at: 'Just now'
        }));
        setDraft('');
      }
    },
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 14,
      color: "#fff"
    })
  }, "Send")))));
}
Object.assign(window, {
  ChildDetail,
  ChildMessages,
  FeedbackDetail,
  RequestFeedback,
  Notifications,
  Messages,
  ChildSwitcher,
  ThreadFeedbackCard,
  AttendanceGrid
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentPhase2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentPhase3.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  Input,
  Checkbox
} = window.ITutorDesignSystem_e4581d;
const {
  Dot,
  PageTitle,
  IconTile
} = window;

/* ── Family calendar ─────────────────────────────────────────────────── */
function FamilyCalendar() {
  const [view, setView] = React.useState('Week');
  const [shown, setShown] = React.useState(window.CHILDREN.map(c => c.id));
  const [copied, setCopied] = React.useState(false);
  const days = ['Mon 1', 'Tue 2', 'Wed 3', 'Thu 4', 'Fri 5', 'Sat 6', 'Sun 7'];
  const events = window.SESSION_EVENTS.filter(e => shown.includes(e.childId));
  const toggle = id => setShown(s => s.includes(id) ? s.filter(x => x !== id) : s.concat(id));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "Every child\u2019s classes in one place, colour-coded."
  }, "Family calendar"), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "September 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, window.CHILDREN.map(c => {
    const on = shown.includes(c.id);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => toggle(c.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 9999,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        background: on ? 'color-mix(in oklab, ' + c.color + ' 12%, #fff)' : '#fff',
        border: '1px solid ' + (on ? c.color : 'var(--surface-border)'),
        color: on ? 'var(--ink)' : '#9ca3af'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: on ? c.color : '#d1d5db'
    }), c.short);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, ['Week', 'Month'].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setView(v),
    style: {
      padding: '6px 14px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      background: view === v ? 'var(--neutral-bg)' : '#fff',
      color: view === v ? 'var(--ink)' : '#6b7280'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 14,
      paddingBottom: 12,
      borderBottom: '1px solid #f3f4f6'
    }
  }, Object.entries(window.ATTENDANCE).map(([k, a]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: '#6b7280'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 9999,
      display: 'grid',
      placeItems: 'center',
      background: a.fg,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 9,
    strokeWidth: 3
  })), a.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: '#6b7280'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 4,
      background: 'var(--brand)'
    }
  }), "Upcoming")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 8
    }
  }, days.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      minHeight: view === 'Week' ? 170 : 100,
      border: '1px solid #f3f4f6',
      borderRadius: 'var(--radius-md)',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: '#9ca3af',
      marginBottom: 6
    }
  }, d), events.filter(e => e.day === i).map(e => {
    const c = window.childBy(e.childId);
    const a = e.attendance ? window.ATTENDANCE[e.attendance] : null;
    return /*#__PURE__*/React.createElement("div", {
      key: e.subject + e.time,
      style: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 6,
        background: a ? a.bg : 'color-mix(in oklab, ' + c.color + ' 12%, #fff)',
        borderLeft: '3px solid ' + (a ? a.fg : c.color)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, e.time), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: '#6b7280'
      }
    }, "\xB7 ", c.short), a && /*#__PURE__*/React.createElement("span", {
      title: a.label,
      style: {
        marginLeft: 'auto',
        width: 14,
        height: 14,
        borderRadius: 9999,
        display: 'grid',
        placeItems: 'center',
        background: a.fg,
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 9,
      strokeWidth: 3
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#4b5563',
        lineHeight: 1.35
      }
    }, e.subject), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#9ca3af'
      }
    }, e.tutor), a && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontSize: 10,
        fontWeight: 'var(--weight-semibold)',
        color: a.fg
      }
    }, a.label, e.lateBy ? ' · ' + e.lateBy + ' min' : ''));
  }))))), /*#__PURE__*/React.createElement(AttendanceSummary, {
    shown: shown
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar-plus",
    bg: "rgba(14,165,233,0.12)",
    fg: "#0284c7",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Add to your calendar"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 10px',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Paste this link into Google Calendar, Apple Calendar or Outlook to keep your family\u2019s classes in sync automatically."), /*#__PURE__*/React.createElement("code", {
    style: {
      display: 'block',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-inset)',
      border: '1px solid #f3f4f6',
      fontSize: 12,
      color: '#4b5563',
      wordBreak: 'break-all'
    }
  }, "https://myitutor.com/parent/calendar.ics?token=fam_8d41c7")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, copied ? 'Copied' : 'Copy link'))));
}
function AttendanceSummary({
  shown
}) {
  const kids = window.CHILDREN.filter(c => shown.includes(c.id));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      marginBottom: 4
    }
  }, "Attendance this month"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Recorded automatically when a student joins the class. Cancelled sessions don\u2019t count against the rate."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + Math.max(kids.length, 1) + ',1fr)',
      gap: 16
    }
  }, kids.length === 0 && /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#9ca3af'
    }
  }, "Turn a child back on above to see their attendance.")), kids.map(c => {
    const s = window.ATTENDANCE_SUMMARY[c.id];
    const rate = s.turnUp;
    const segs = [['attended', s.attended], ['late', s.late], ['absent', s.absent], ['cancelled', s.cancelled]];
    const total = segs.reduce((n, [, v]) => n + v, 0);
    return /*#__PURE__*/React.createElement(Card, {
      key: c.id,
      padding: "20px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + c.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, c.short), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26,
        fontWeight: 'var(--weight-bold)',
        lineHeight: 1,
        color: rate >= 90 ? 'var(--itutor-green)' : rate >= 75 ? '#b45309' : '#dc2626',
        fontVariantNumeric: 'tabular-nums'
      }
    }, rate, "%"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--ink-muted)'
      }
    }, "of ", s.counted, " sessions"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: 10,
        borderRadius: 9999,
        overflow: 'hidden',
        gap: 2,
        marginBottom: 12
      }
    }, segs.filter(([, v]) => v > 0).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
      key: k,
      title: window.ATTENDANCE[k].label + ': ' + v,
      style: {
        width: v / total * 100 + '%',
        background: window.ATTENDANCE[k].fg,
        opacity: k === 'cancelled' ? 0.35 : 1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 8
      }
    }, segs.map(([k, v]) => {
      const a = window.ATTENDANCE[k];
      return /*#__PURE__*/React.createElement("div", {
        key: k
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: 9999,
          background: a.fg,
          opacity: k === 'cancelled' ? 0.35 : 1
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 18,
          fontWeight: 'var(--weight-bold)',
          color: 'var(--ink)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums'
        }
      }, v)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: 'var(--ink-muted)',
          marginTop: 3
        }
      }, a.label));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        paddingTop: 12,
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, s.streak, "-session streak"), s.absent > 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#4b5563'
      }
    }, "Last absence: CAPE Chemistry, Tue 2 Sep.") : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#6b7280'
      }
    }, "No absences this month.")));
  })));
}

/* ── Billing — a section inside Settings, not a destination ──────────── */
const SUBS = [{
  id: 's1',
  childId: 'c1',
  name: 'Maths Intensive — Paper 2 Drills',
  tutor: 'Anisa Mohammed',
  cycle: 'Monthly',
  next: '1 Oct 2026',
  amount: 250,
  failed: true,
  state: 'active'
}, {
  id: 's2',
  childId: 'c1',
  name: 'CSEC Mathematics 1:1 (8 sessions/mo)',
  tutor: 'Anisa Mohammed',
  cycle: 'Monthly',
  next: '12 Sep 2026',
  amount: 1512,
  state: 'active'
}, {
  id: 's3',
  childId: 'c2',
  name: 'CAPE Chemistry 1:1 (4 sessions/mo)',
  tutor: 'Kavita Singh',
  cycle: 'Monthly',
  next: '15 Sep 2026',
  amount: 504,
  state: 'tutor-paused'
}];
const CARDS = [{
  brand: 'Visa',
  last4: '4242',
  exp: '09/2026',
  daysLeft: 12
}, {
  brand: 'Mastercard',
  last4: '8891',
  exp: '04/2029',
  daysLeft: 960
}];
/* Warnings at 30, 14 and 7 days. No pre-emptive email exists, so the warning has
   to live where the parent can see it. */
const expiryWarning = d => d > 30 ? null : d <= 7 ? {
  tone: 'danger',
  text: 'Expires in ' + d + ' days'
} : d <= 14 ? {
  tone: 'warning',
  text: 'Expires in ' + d + ' days'
} : {
  tone: 'amber',
  text: 'Expires within 30 days'
};
function CancelSubModal({
  sub,
  onClose,
  onConfirm
}) {
  const {
    Modal
  } = window.ITutorDesignSystem_e4581d;
  const child = window.childBy(sub.childId);
  const reasons = ['Too expensive', 'Not using it enough', 'Exams are over', 'Switching tutor', 'Not happy with the classes', 'Something else'];
  const [reason, setReason] = React.useState(null);
  return /*#__PURE__*/React.createElement(Modal, {
    title: 'Cancel ' + sub.name + '?',
    size: "md",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: onClose
    }, "Keep subscription"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      disabled: !reason,
      onClick: () => onConfirm(reason),
      style: {
        background: '#dc2626'
      }
    }, "Cancel subscription"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      padding: 14,
      borderRadius: 'var(--radius-lg)',
      background: '#fffbeb',
      border: '1px solid #fde68a',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "pause",
    bg: "#fff",
    fg: "#b45309",
    size: 36
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Pause instead?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#4b5563'
    }
  }, "Pausing keeps ", child.short, "\u2019s place and the same tutor, and stops all charges until you resume. Cancelling releases the place."))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: '#374151'
    }
  }, "Why are you cancelling?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginBottom: 14
    }
  }, reasons.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => setReason(r),
    style: {
      textAlign: 'left',
      padding: '11px 14px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      background: reason === r ? '#f0fdf4' : '#fff',
      border: '1px solid ' + (reason === r ? 'var(--itutor-green)' : 'var(--surface-border)'),
      color: 'var(--ink)'
    }
  }, r))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Classes already paid for stay on the calendar. The next charge on ", sub.next, " won\u2019t be taken."));
}
function BillingSection({
  onGo
}) {
  const [filter, setFilter] = React.useState('All children');
  const [subs, setSubs] = React.useState(SUBS);
  const [cancelling, setCancelling] = React.useState(null);
  const [note, setNote] = React.useState(null);
  const tx = window.TRANSACTIONS.filter(t => filter === 'All children' || window.childBy(t.childId).short === filter);
  const setState = (id, state) => setSubs(ss => ss.map(s => s.id === id ? {
    ...s,
    state
  } : s));
  const flash = m => {
    setNote(m);
    setTimeout(() => setNote(null), 3000);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid #dc2626'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "alert-triangle",
    bg: "rgba(239,68,68,0.1)",
    fg: "#dc2626",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: "#9333EA"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Aaliyah \xB7 Maths Intensive \u2014 Paper 2 Drills"), /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, "Payment failed")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Visa \xB7\xB7\xB7\xB7 4242 was declined on 1 Sep for ", window.money(250), ". Aaliyah is ", /*#__PURE__*/React.createElement("strong", null, "not enrolled"), " \u2014 no place is held while this is outstanding, and another student can take it. Retrying with the same card usually works if the decline was a limit.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => onGo && onGo('Checkout', 'failed')
  }, "Retry payment"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Update card")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 12
    }
  }, "Payment methods"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, CARDS.map(c => {
    const w = expiryWarning(c.daysLeft);
    return /*#__PURE__*/React.createElement(Card, {
      key: c.last4,
      padding: "18px",
      hoverLift: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(IconTile, {
      name: "credit-card",
      bg: "var(--neutral-bg)",
      fg: "#4b5563",
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, c.brand, " \xB7\xB7\xB7\xB7 ", c.last4), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, "Expires ", c.exp))), w ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: w.tone,
      style: {
        background: 'var(--coral-soft)',
        color: '#c2410c'
      }
    }, w.text), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Update")) : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Backup card"));
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      border: '1px dashed var(--surface-border)',
      borderRadius: 'var(--radius-xl)',
      background: 'transparent',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      gap: 6,
      padding: 18,
      color: '#9ca3af',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 18
  }), " Add payment method"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 12
    }
  }, "Subscriptions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, subs.map(s => {
    const c = window.childBy(s.childId);
    const paused = s.state === 'paused';
    const tutorPaused = s.state === 'tutor-paused';
    const cancelled = s.state === 'cancelled';
    return /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      padding: "18px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + (cancelled ? '#d1d5db' : c.color),
        opacity: cancelled ? 0.7 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 260
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: cancelled ? '#d1d5db' : c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)',
        textDecoration: cancelled ? 'line-through' : 'none'
      }
    }, s.name), s.failed && !cancelled && /*#__PURE__*/React.createElement(Badge, {
      tone: "danger"
    }, "Payment failed"), paused && /*#__PURE__*/React.createElement(Badge, {
      tone: "amber"
    }, "Paused by you"), tutorPaused && /*#__PURE__*/React.createElement(Badge, {
      tone: "amber"
    }, "Paused by tutor"), cancelled && /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Cancelled")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)',
        marginTop: 2
      }
    }, c.short, " \xB7 ", s.tutor, " \xB7 ", s.cycle, " \xB7 ", cancelled ? 'no further charges' : paused ? 'charges stopped — place held' : tutorPaused ? 'Kavita Singh paused this class for the holidays — billing stopped for every family enrolled' : 'next charge ' + s.next), tutorPaused && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        background: '#fffbeb',
        border: '1px solid #fde68a'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "amber",
      shape: "rect",
      uppercase: true
    }, "TODO \xA77.4"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#78350f'
      }
    }, "Consequences of a tutor-wide pause are unsettled \u2014 no parent-side control is offered until they are."))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--weight-extrabold)',
        color: cancelled || tutorPaused ? '#9ca3af' : 'var(--ink)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.money(s.amount)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, cancelled ? /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => {
        setState(s.id, 'active');
        flash('Subscription restarted — next charge ' + s.next + '.');
      }
    }, "Restart") : tutorPaused ? /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      disabled: true
    }, "Paused by tutor") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: paused ? 'play' : 'pause',
        size: 14
      }),
      onClick: () => {
        setState(s.id, paused ? 'active' : 'paused');
        flash(paused ? 'Resumed — billing restarts on ' + s.next + '.' : 'Paused — no charges until you resume. The place is held.');
      }
    }, paused ? 'Resume' : 'Pause'), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => setCancelling(s),
      style: {
        color: '#dc2626',
        borderColor: '#fecaca'
      }
    }, "Cancel")))));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Transactions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, ['All children', 'Aaliyah', 'Josiah'].map(fl => /*#__PURE__*/React.createElement("button", {
    key: fl,
    onClick: () => setFilter(fl),
    style: {
      padding: '6px 14px',
      borderRadius: 9999,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      background: filter === fl ? 'var(--itutor-green)' : '#fff',
      color: filter === fl ? '#fff' : '#4b5563',
      border: '1px solid ' + (filter === fl ? 'var(--itutor-green)' : 'var(--surface-border)')
    }
  }, fl)))), /*#__PURE__*/React.createElement(Card, {
    padding: "8px 20px",
    hoverLift: false
  }, tx.map((t, i) => {
    const c = window.childBy(t.childId);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 0',
        borderTop: i ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#9ca3af',
        width: 92
      }
    }, t.date), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        width: 110
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: '#4b5563'
      }
    }, c.short)), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: '#374151'
      }
    }, t.desc), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.money(t.amount)), /*#__PURE__*/React.createElement(Badge, {
      tone: t.status === 'Paid' ? 'success' : t.status === 'Failed' ? 'danger' : 'neutral'
    }, t.status), t.status === 'Failed' && /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => onGo && onGo('Checkout', 'failed')
    }, "Retry"));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 12
    }
  }, "Spend by child"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 16
    }
  }, window.CHILDREN.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.id,
    padding: "20px",
    hoverLift: false,
    style: {
      borderLeft: '4px solid ' + c.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: c.color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, c.short)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12
    }
  }, [['This month', c.id === 'c1' ? 439 : 252], ['All time', c.id === 'c1' ? 4820 : 1890], ['Avg / session', c.id === 'c1' ? 69 : 63]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      lineHeight: 1.1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, window.money(v)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, l)))))))), cancelling && /*#__PURE__*/React.createElement(CancelSubModal, {
    sub: cancelling,
    onClose: () => setCancelling(null),
    onConfirm: reason => {
      setState(cancelling.id, 'cancelled');
      flash('Cancelled — ' + cancelling.name + '. Reason recorded: ' + reason.toLowerCase() + '.');
      setCancelling(null);
    }
  }), note && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 60,
      maxWidth: 560,
      background: 'var(--ink)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 'var(--radius-lg)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      boxShadow: 'var(--shadow-card)'
    }
  }, note));
}

/* ── Settings — account, billing and per-child controls ──────────────── */
function Toggle({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      width: 42,
      height: 24,
      borderRadius: 9999,
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      background: on ? 'var(--itutor-green)' : '#e5e7eb',
      transition: 'background var(--dur-base) var(--ease-out)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 21 : 3,
      width: 18,
      height: 18,
      borderRadius: 9999,
      background: '#fff',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  }));
}
const SETTINGS_SECTIONS = ['Account', 'Billing', 'Children'];
function Settings({
  onGo,
  section
}) {
  const [tab, setTab] = React.useState(section || 'Children');
  const [state, setState] = React.useState({
    c1: {
      approval: true,
      limit: '1500',
      selfPay: false
    },
    c2: {
      approval: true,
      limit: '',
      selfPay: false
    }
  });
  const set = (id, k, v) => setState(s => ({
    ...s,
    [id]: {
      ...s[id],
      [k]: v
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "Your account, your cards and what each child can do on their own."
  }, "Settings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border)'
    }
  }, SETTINGS_SECTIONS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: '10px 14px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: tab === t ? 'var(--ink)' : '#9ca3af',
      borderBottom: '2px solid ' + (tab === t ? 'var(--itutor-green)' : 'transparent'),
      marginBottom: -1
    }
  }, t))), tab === 'Account' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      marginBottom: 16
    }
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    value: "Priya Ramkissoon"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    value: "priya.ramkissoon@gmail.com"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Save changes"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Change password")))), /*#__PURE__*/React.createElement(Card, {
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "bell",
    bg: "rgba(139,92,246,0.12)",
    fg: "#7c3aed",
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Notification preferences"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "Push and email toggles, and per-child mutes.")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => onGo('Notifications')
  }, "Open")))), tab === 'Billing' && /*#__PURE__*/React.createElement(BillingSection, {
    onGo: onGo
  }), tab === 'Children' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 820
    }
  }, window.CHILDREN.map(c => {
    const s = state[c.id];
    return /*#__PURE__*/React.createElement(Card, {
      key: c.id,
      padding: "24px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + c.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      size: 36,
      hue: c.color === '#9333EA' ? 300 : 250
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, c.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, c.form))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '14px 0',
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, "Booking approval required"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, s.approval ? c.short + '\u2019s requests come to your approvals queue first \u2014 including free classes, where you are agreeing to the enrolment.' : c.short + ' can join classes without asking. You\u2019ll still be notified.')), /*#__PURE__*/React.createElement(Toggle, {
      on: s.approval,
      onToggle: () => set(c.id, 'approval', !s.approval)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '14px 0',
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, "Monthly spend limit"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, "Once reached, every new request needs approval regardless of the toggle above.")), /*#__PURE__*/React.createElement(Input, {
      placeholder: "No limit",
      value: s.limit,
      onChange: e => set(c.id, 'limit', e.target.value),
      trailing: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: '#9ca3af'
        }
      }, "TTD"),
      style: {
        width: 150
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '14px 0 0',
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)'
      }
    }, "Let ", c.short, " pay for their own classes"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, s.selfPay ? c.short + ' pays with their own card and no longer needs your approval. This is in effect now.' : c.short + ' cannot pay for classes; every request comes to you.'), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        fontSize: 11,
        color: '#9ca3af',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Turning this on takes effect immediately. A security email goes to you either way, and changing your password puts it back.")), /*#__PURE__*/React.createElement(Toggle, {
      on: s.selfPay,
      onToggle: () => set(c.id, 'selfPay', !s.selfPay)
    })));
  })));
}

/* ── Children list ───────────────────────────────────────────────────── */
function ChildrenList({
  onOpen,
  onPreviewEmpty
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "Two children linked.",
    right: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: onPreviewEmpty,
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "eye",
        size: 14
      })
    }, "Preview new-parent state")
  }, "Children"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 16
    }
  }, window.CHILDREN.map(c => /*#__PURE__*/React.createElement(window.ChildCard, {
    key: c.id,
    child: c,
    onOpen: () => onOpen(c.id)
  }))), /*#__PURE__*/React.createElement(window.LinkChildRow, null));
}
Object.assign(window, {
  FamilyCalendar,
  AttendanceSummary,
  BillingSection,
  CancelSubModal,
  Settings,
  ChildrenList,
  Toggle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentPhase3.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentPhase4.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  Input,
  VerifiedBadge,
  StarRating,
  SubjectPill
} = window.ITutorDesignSystem_e4581d;
const {
  Dot,
  PageTitle,
  IconTile,
  SeatNotice
} = window;

/* ── Stripe Checkout handoff — five states ───────────────────────────── */
const CHECKOUT_STATES = [{
  key: 'pre',
  label: 'Pre-redirect'
}, {
  key: 'success',
  label: 'Success'
}, {
  key: 'cancelled',
  label: 'Cancelled'
}, {
  key: 'failed',
  label: 'Payment failed'
}, {
  key: 'taken',
  label: 'Seat taken'
}];
const ORDER = {
  childId: 'c1',
  class: 'Maths Intensive — Paper 2 Drills',
  tutor: 'Anisa Mohammed',
  when: 'Sat 6 Sep · 10:00 AM',
  amount: 250,
  cadence: 'Monthly, on the 1st',
  renews: '1 Oct 2026',
  closesAt: 'Sat 6 Sep, 8:00 AM'
};
function CheckoutShell({
  tone,
  icon,
  title,
  children,
  actions
}) {
  const tint = {
    green: ['rgba(25,147,86,0.1)', 'var(--itutor-green)'],
    neutral: ['var(--neutral-bg)', '#6b7280'],
    rose: ['rgba(239,68,68,0.1)', '#dc2626'],
    amber: ['rgba(245,158,11,0.14)', '#b45309']
  }[tone];
  return /*#__PURE__*/React.createElement(Card, {
    padding: "32px",
    hoverLift: false,
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: icon,
    bg: tint[0],
    fg: tint[1],
    size: 48
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      margin: '16px 0 8px'
    }
  }, title), children, actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 22,
      flexWrap: 'wrap'
    }
  }, actions));
}
function OrderSummary() {
  const child = window.childBy(ORDER.childId);
  return /*#__PURE__*/React.createElement(Card, {
    variant: "inset",
    padding: "16px",
    hoverLift: false,
    style: {
      marginTop: 4
    }
  }, [['Student', /*#__PURE__*/React.createElement("span", {
    key: "s",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    color: child.color
  }), child.name)], ['Class', ORDER.class], ['Tutor', ORDER.tutor], ['First session', ORDER.when], ['Billing', ORDER.cadence]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      padding: '6px 0',
      fontSize: 'var(--text-xs)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#6b7280'
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink)',
      fontWeight: 'var(--weight-semibold)',
      textAlign: 'right'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 10,
      marginTop: 6,
      borderTop: '1px solid #e5e7eb',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total today"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, window.money(ORDER.amount))));
}
function Checkout({
  state: initial,
  onGo
}) {
  const [state, setState] = React.useState(initial || 'pre');
  React.useEffect(() => {
    if (initial) setState(initial);
  }, [initial]);
  const child = window.childBy(ORDER.childId);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement(PageTitle, {
    sub: "Five states the parent can land in. Payment itself happens on Stripe\u2019s page \u2014 none of this is a card form."
  }, "Checkout handoff"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, CHECKOUT_STATES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    onClick: () => setState(s.key),
    style: {
      padding: '6px 12px',
      borderRadius: 9999,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      background: state === s.key ? 'var(--ink)' : '#fff',
      color: state === s.key ? '#fff' : '#6b7280',
      border: '1px solid ' + (state === s.key ? 'var(--ink)' : 'var(--surface-border)')
    }
  }, s.label))), state === 'pre' && /*#__PURE__*/React.createElement(CheckoutShell, {
    tone: "green",
    icon: "lock",
    title: 'Approve and pay for ' + child.short + '\u2019s place',
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => setState('success')
    }, "Continue to Stripe"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setState('cancelled')
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "You\u2019ll finish on Stripe\u2019s secure payment page. iTutor never sees your card details."), /*#__PURE__*/React.createElement(OrderSummary, null), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#6b7280',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "This is a monthly subscription. It renews on the 1st until you pause or cancel it in Settings.")), state === 'success' && /*#__PURE__*/React.createElement(CheckoutShell, {
    tone: "green",
    icon: "check-circle-2",
    title: child.short + ' is enrolled',
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => onGo('Calendar')
    }, "View the class"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onGo('Dashboard')
    }, "Back to dashboard"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, window.money(ORDER.amount), " paid. ", /*#__PURE__*/React.createElement("strong", null, child.name), " has a place in ", /*#__PURE__*/React.createElement("strong", null, ORDER.class), " with ", ORDER.tutor, ", starting ", ORDER.when, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      marginTop: 14,
      padding: '12px 14px',
      background: 'rgba(25,147,86,0.07)',
      border: '1px solid rgba(25,147,86,0.25)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "repeat",
    size: 16,
    color: "var(--itutor-green)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#166534',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Renews ", /*#__PURE__*/React.createElement("strong", null, ORDER.renews), " and monthly after that. Renewals go through on their own \u2014 you won\u2019t be asked again."))), state === 'cancelled' && /*#__PURE__*/React.createElement(CheckoutShell, {
    tone: "neutral",
    icon: "arrow-left-circle",
    title: "Payment not completed",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => setState('pre')
    }, "Try again"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onGo('Approvals')
    }, "Back to requests"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "You left Stripe before finishing. Nothing was charged and ", child.short, "\u2019s request is still waiting for you."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(SeatNotice, {
    closesAt: ORDER.closesAt
  }))), state === 'failed' && /*#__PURE__*/React.createElement(CheckoutShell, {
    tone: "rose",
    icon: "alert-triangle",
    title: "Your card was declined",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => setState('success')
    }, "Retry payment"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onGo('Settings')
    }, "Update card"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Visa \xB7\xB7\xB7\xB7 4242 was declined for ", window.money(ORDER.amount), " \u2014 ", /*#__PURE__*/React.createElement("strong", null, ORDER.class), " for ", child.name, "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, child.short, " is ", /*#__PURE__*/React.createElement("strong", null, "not enrolled"), ". No place is held while this is outstanding and another student can take it.")), state === 'taken' && /*#__PURE__*/React.createElement(CheckoutShell, {
    tone: "amber",
    icon: "users",
    title: "The last place went while you were paying",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => onGo('Booking')
    }, "Find another class"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onGo('Dashboard')
    }, "Back to dashboard"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, ORDER.class), " filled before your payment finished, so ", child.short, " could not be enrolled."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "The ", window.money(ORDER.amount), " is being refunded to Visa \xB7\xB7\xB7\xB7 4242 automatically. It usually lands within five working days. ", /*#__PURE__*/React.createElement("strong", null, "There is nothing for you to do."))));
}

/* ── Booking flow — the parent's own path ────────────────────────────── */
/* Browsing is neutral: no "shopping as" mode and no child in the header. The
   child is chosen inside the flow, and only then do the two checks resolve. */
const LISTINGS = [{
  id: 'l1',
  title: 'CSEC Mathematics — Paper 2 Drills',
  tutor: 'Anisa Mohammed',
  form: 'Form 4',
  when: 'Saturdays · 10:00 AM',
  price: 250,
  cadence: '/mo',
  rating: 4.9,
  count: 42,
  seats: '3 of 12 places left'
}, {
  id: 'l2',
  title: 'CAPE Chemistry — Unit 1 revision',
  tutor: 'Kavita Singh',
  form: 'Form 6',
  when: 'Sundays · 2:00 PM',
  price: 300,
  cadence: '/mo',
  rating: 4.8,
  count: 27,
  seats: '6 of 10 places left'
}, {
  id: 'l3',
  title: 'SEA Maths Clinic',
  tutor: 'Anisa Mohammed',
  form: 'Std 5',
  when: 'Wednesdays · 6:00 PM',
  price: 0,
  cadence: '',
  rating: 5,
  count: 9,
  seats: 'Free · open'
}];

/* Per child, per listing: does this clash, and does the form level match? */
const CHECKS = {
  c1: {
    l1: {
      conflict: false,
      level: 'Form 5'
    },
    l2: {
      conflict: true,
      at: 'CAPE Chemistry lab prep, Sun 7 Sep 2:00 PM',
      level: 'Form 5',
      alternatives: []
    },
    l3: {
      conflict: false,
      level: 'Form 5'
    }
  },
  c2: {
    l1: {
      conflict: true,
      at: 'Saturday football, 9:30 AM',
      level: 'Form 3',
      alternatives: [{
        tutor: 'Marcus Alleyne',
        title: 'CSEC Maths — Paper 2, Sundays 11:00 AM',
        price: 220
      }, {
        tutor: 'Anisa Mohammed',
        title: 'CSEC Maths — Paper 2, Wednesdays 5:00 PM',
        price: 250
      }]
    },
    l2: {
      conflict: false,
      level: 'Form 3'
    },
    l3: {
      conflict: false,
      level: 'Form 3'
    }
  }
};
function CheckRow({
  ok,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: ok ? 'rgba(25,147,86,0.07)' : 'var(--neutral-bg)',
      border: '1px solid ' + (ok ? 'rgba(25,147,86,0.25)' : '#e5e7eb')
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ok ? 'check' : 'info',
    size: 15,
    color: ok ? 'var(--itutor-green)' : '#6b7280',
    strokeWidth: 2.2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 'var(--text-xs)',
      color: ok ? '#166534' : '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children));
}
function Booking({
  onGo
}) {
  const [listing, setListing] = React.useState(null);
  const [childId, setChildId] = React.useState(null);
  const [levelOk, setLevelOk] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const single = window.CHILDREN.length === 1;
  React.useEffect(() => {
    if (listing && single) setChildId(window.CHILDREN[0].id);
  }, [listing, single]);
  const check = listing && childId ? CHECKS[childId][listing.id] : null;
  const child = childId ? window.childBy(childId) : null;
  const levelMismatch = check && check.level !== listing.form;
  const canPay = check && !check.conflict && (!levelMismatch || levelOk);
  if (!listing) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 16,
        maxWidth: 1020
      }
    }, /*#__PURE__*/React.createElement(PageTitle, {
      sub: "Browse as yourself. You pick which child after choosing a class."
    }, "Find a class"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Search subject, exam or tutor",
      style: {
        flex: 1,
        minWidth: 280
      },
      leading: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 15
      })
    }), ['CSEC', 'CAPE', 'SEA'].map(x => /*#__PURE__*/React.createElement(SubjectPill, {
      key: x
    }, x))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16
      }
    }, LISTINGS.map(l => /*#__PURE__*/React.createElement(Card, {
      key: l.id,
      padding: "18px",
      onClick: () => {
        setListing(l);
        setChildId(single ? window.CHILDREN[0].id : null);
        setLevelOk(false);
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: l.tutor,
      size: 36,
      hue: 150
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, l.tutor, " ", /*#__PURE__*/React.createElement(VerifiedBadge, {
      size: 12
    })), /*#__PURE__*/React.createElement(StarRating, {
      value: l.rating,
      count: l.count,
      size: 11
    }))), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)',
        letterSpacing: 0,
        marginBottom: 6
      }
    }, l.title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 12px',
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, l.form, " \xB7 ", l.when), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 800,
        color: 'var(--ink)'
      }
    }, l.price ? window.money(l.price) + l.cadence : 'Free'), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#9ca3af'
      }
    }, l.seats))))));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setListing(null);
      setChildId(null);
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " All classes"), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      paddingBottom: 18,
      borderBottom: '1px solid #f3f4f6',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: listing.tutor,
    size: 48,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, listing.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, listing.tutor, " \xB7 ", listing.form, " \xB7 ", listing.when)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--ink)'
    }
  }, listing.price ? window.money(listing.price) + listing.cadence : 'Free'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, listing.seats))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 18
    }
  }, single ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, "Booking for ", window.CHILDREN[0].name, " \u2014 your only linked child.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Who is this for?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14,
      flexWrap: 'wrap'
    }
  }, window.CHILDREN.map(c => {
    const on = c.id === childId;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => {
        setChildId(c.id);
        setLevelOk(false);
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        background: on ? 'color-mix(in oklab, ' + c.color + ' 12%, #fff)' : '#fff',
        border: '1px solid ' + (on ? c.color : 'var(--surface-border)'),
        color: on ? 'var(--ink)' : '#6b7280'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      color: c.color
    }), c.short, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--weight-regular)',
        color: '#9ca3af',
        fontSize: 11
      }
    }, c.form));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px',
      fontSize: 11,
      color: '#9ca3af'
    }
  }, "One child per checkout. Two children in the same class means two separate payments \u2014 do this one first, then repeat.")), check && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, check.conflict ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CheckRow, {
    ok: false
  }, /*#__PURE__*/React.createElement("strong", null, "This student has a class which would conflict with this schedule."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      color: '#6b7280'
    }
  }, "Clashes with ", check.at, ".")), check.alternatives && check.alternatives.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Instead try these classes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, check.alternatives.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.title,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: a.tutor,
    size: 30,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, a.tutor)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, window.money(a.price), "/mo"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "View"))))) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-sm)',
      color: '#4b5563'
    }
  }, "No tutors found.")) : /*#__PURE__*/React.createElement(CheckRow, {
    ok: true
  }, "No schedule conflicts"), levelMismatch && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: '#fffbeb',
      border: '1px solid #fde68a'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 'var(--text-xs)',
      color: '#78350f',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Your student is in ", check.level, ", this is a ", listing.form, " class \u2014 are you sure this is the right class?"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevelOk(!levelOk),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: '#78350f'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 4,
      border: '2px solid #b45309',
      background: levelOk ? '#b45309' : 'transparent',
      display: 'grid',
      placeItems: 'center'
    }
  }, levelOk && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    color: "#fff",
    strokeWidth: 3
  })), "Yes, this is the class I want"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginTop: 18,
      paddingTop: 18,
      borderTop: '1px solid #f3f4f6',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: !canPay,
    onClick: () => onGo('Checkout', 'pre')
  }, listing.price ? 'Continue to Stripe · ' + window.money(listing.price) : 'Enrol ' + (child ? child.short : '') + ' — free'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, !childId ? 'Pick a child first.' : check && check.conflict ? 'Resolve the clash to continue.' : 'You are the decision-maker, so this needs no approval step.')), note && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#b45309'
    }
  }, note))));
}
Object.assign(window, {
  Checkout,
  Booking,
  CheckoutShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentPhase4.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ParentShellView.jsx
try { (() => {
const {
  SidebarNavItem,
  Icon,
  Avatar,
  Badge
} = window.ITutorDesignSystem_e4581d;
const NAV = [{
  label: 'Dashboard',
  icon: 'layout-dashboard',
  tint: {
    bg: 'rgba(16,185,129,0.2)',
    fg: '#6ee7b7',
    ring: 'rgba(52,211,153,0.3)'
  }
}, {
  label: 'Approvals',
  icon: 'shield-check',
  tint: {
    bg: 'rgba(245,158,11,0.2)',
    fg: '#fcd34d',
    ring: 'rgba(251,191,36,0.3)'
  },
  badge: 'approvals'
}, {
  label: 'Children',
  icon: 'users',
  tint: {
    bg: 'rgba(168,85,247,0.2)',
    fg: '#d8b4fe',
    ring: 'rgba(192,132,252,0.3)'
  }
}, {
  label: 'Calendar',
  icon: 'calendar-days',
  tint: {
    bg: 'rgba(14,165,233,0.2)',
    fg: '#7dd3fc',
    ring: 'rgba(56,189,248,0.3)'
  }
}, {
  label: 'Feedback',
  icon: 'message-square',
  tint: {
    bg: 'rgba(244,63,94,0.2)',
    fg: '#fda4af',
    ring: 'rgba(251,113,133,0.3)'
  },
  badge: 'messages'
}];
/* Notifications and Settings are deliberately NOT in the sidebar — they are
   reached only from the bell and gear in the top bar. Billing is a section inside
   Settings, not a destination of its own. */

function CountDot({
  n
}) {
  if (!n) return null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      borderRadius: '9999px',
      background: 'var(--brand)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 'var(--weight-bold)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-sans)'
    }
  }, n);
}
function ParentShellView({
  active,
  onNavigate,
  counts = {},
  children,
  title
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      overflow: 'hidden',
      background: 'color-mix(in oklab, var(--muted) 30%, #fff)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    className: "dark",
    style: {
      width: collapsed ? 64 : 240,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      background: 'var(--ink)',
      transition: 'width var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '16px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      justifyContent: collapsed ? 'center' : 'flex-start'
    }
  }, collapsed ? /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-mark.png",
    alt: "iTutor",
    style: {
      width: 28,
      height: 28,
      borderRadius: 6,
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-logo-dark.png",
    alt: "iTutor",
    style: {
      height: 28,
      flex: 1,
      objectFit: 'contain',
      objectPosition: 'left'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCollapsed(c => !c),
    style: {
      width: 32,
      height: 32,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: collapsed ? 'panel-left-open' : 'panel-left-close',
    size: 16
  }))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: 12,
      display: 'grid',
      gap: 2,
      alignContent: 'start'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.label,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SidebarNavItem, {
    label: n.label,
    icon: n.icon,
    tint: n.tint,
    collapsed: collapsed,
    active: active === n.label,
    onClick: () => onNavigate(n.label)
  }), n.badge && counts[n.badge] ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: collapsed ? 2 : 12,
      right: collapsed ? 2 : 10,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(CountDot, {
    n: counts[n.badge]
  })) : null))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Priya Ramkissoon",
    size: 36,
    hue: 330
  }), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#fff'
    }
  }, "Priya Ramkissoon"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Parent")), !collapsed && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-up",
    size: 16,
    color: "rgba(255,255,255,0.6)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--topbar-h)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('Notifications'),
    title: "Notifications",
    style: {
      position: 'relative',
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '9999px',
      border: 'none',
      background: 'transparent',
      color: 'var(--muted-foreground)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 16
  }), counts.notifications ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      right: 2
    }
  }, /*#__PURE__*/React.createElement(CountDot, {
    n: counts.notifications
  })) : null), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('Settings'),
    title: "Settings",
    style: {
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '9999px',
      border: 'none',
      background: 'transparent',
      color: 'var(--muted-foreground)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 16
  })))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: '32px'
    }
  }, children)));
}
Object.assign(window, {
  ParentShellView,
  CountDot
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ParentShellView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      "data-om-starter": "ios-frame",
      style: {
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#000' : '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: '-apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
        height: 37,
        borderRadius: 24,
        background: '#000',
        zIndex: 50
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement(IOSStatusBar, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
      title: title,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 8,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 139,
        height: 5,
        borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
      }
    })))
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/student-app/StudentScreens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Card,
  StatCard,
  Badge,
  Button,
  Icon,
  TutorCard,
  GroupCard,
  SubjectPill,
  Avatar,
  StarRating,
  Modal,
  Input,
  SearchField
} = window.ITutorDesignSystem_e4581d;
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 6px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--itutor-green)'
    }
  }, children);
}
function Dashboard({
  name,
  session,
  onFind
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 24,
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Good afternoon"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 36,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#111827'
    }
  }, "Welcome back, ", name, " \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: '#6b7280'
    }
  }, "Ready to keep learning today?")), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    style: {
      borderLeft: '4px solid var(--itutor-green)'
    },
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(25,147,86,0.1)',
      color: 'var(--itutor-green)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 20,
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Your next step"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 20,
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0
    }
  }, "CSEC Mathematics"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 16px',
      fontSize: 'var(--text-sm)',
      color: '#6b7280'
    }
  }, "You haven\u2019t found a tutor for this subject yet. Connect with a verified iTutor and start making progress today."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onFind,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16,
      color: "#fff"
    })
  }, "Find an iTutor"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Edit my subjects"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Completed Sessions",
    value: 18,
    icon: "badge-check"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Hours Learned",
    value: 27,
    icon: "clock",
    tone: "neutral"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Subjects Enrolled",
    value: 4,
    icon: "book-open",
    tone: "neutral"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--neutral-bg)',
      color: '#6b7280'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 16,
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0
    }
  }, "Your Next Session")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--itutor-green)'
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement(Card, {
    variant: "inset",
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0
    }
  }, session.subject), /*#__PURE__*/React.createElement(Badge, {
    tone: "success"
  }, "Upcoming")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-sm)',
      color: '#6b7280'
    }
  }, "with ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#374151'
    }
  }, session.tutor)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 16,
    color: "#9ca3af"
  }), session.date), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16,
    color: "#9ca3af"
  }), session.time, " \xB7 ", session.minutes, " min")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "View session details")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      paddingTop: 12,
      borderTop: '1px solid #f3f4f6',
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, "+ 2 more upcoming sessions")), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0,
      marginBottom: 14
    }
  }, "My Subjects"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, ['CSEC Mathematics', 'Physics', 'English A', 'Chemistry'].map(s => /*#__PURE__*/React.createElement(SubjectPill, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      paddingTop: 16,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0,
      marginBottom: 10
    }
  }, "Recent review you left"), /*#__PURE__*/React.createElement(StarRating, {
    value: 5
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#6b7280'
    }
  }, "\u201CBroke down past-paper questions step by step. Finally clicked.\u201D")))));
}
const TUTORS = [{
  name: 'Anisa Mohammed',
  rating: 4.9,
  ratingCount: 42,
  verified: true,
  price: 120,
  subjects: ['CSEC Mathematics', 'Physics', 'Add Maths', 'Chemistry']
}, {
  name: 'Kavita Singh',
  rating: 4.8,
  ratingCount: 19,
  verified: true,
  price: 100,
  subjects: ['CAPE Biology', 'Chemistry', 'Integrated Science']
}, {
  name: 'Darren Joseph',
  rating: null,
  ratingCount: 0,
  verified: false,
  price: 90,
  subjects: ['English A', 'Literature', 'SBA Help']
}, {
  name: 'Shivani Bahadur',
  rating: 5,
  ratingCount: 8,
  verified: true,
  price: 150,
  subjects: ['SEA Preparation', 'Mathematics']
}, {
  name: 'Marcus Alleyne',
  rating: 4.6,
  ratingCount: 31,
  verified: true,
  price: 110,
  subjects: ['CAPE Pure Maths', 'Physics']
}, {
  name: 'Renée Charles',
  rating: 4.7,
  ratingCount: 12,
  verified: true,
  price: 130,
  subjects: ['Spanish', 'French', 'English A']
}];
function Explore({
  onBook
}) {
  const [q, setQ] = React.useState('');
  const [subject, setSubject] = React.useState('All subjects');
  const filters = ['All subjects', 'CSEC', 'CAPE', 'SEA', 'Mathematics', 'Sciences', 'Languages'];
  const list = TUTORS.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#111827'
    }
  }, "Find an iTutor"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: '#6b7280'
    }
  }, list.length, " verified tutors match your subjects.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    width: 320,
    placeholder: "Search tutors by name\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, filters.map(fl => {
    const on = fl === subject;
    return /*#__PURE__*/React.createElement("button", {
      key: fl,
      onClick: () => setSubject(fl),
      style: {
        padding: '6px 14px',
        borderRadius: '9999px',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
        background: on ? 'var(--itutor-green)' : '#fff',
        color: on ? '#fff' : '#4b5563',
        border: '1px solid ' + (on ? 'var(--itutor-green)' : 'var(--surface-border)')
      }
    }, fl);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-mint-wash",
    style: {
      padding: 20,
      borderRadius: 'var(--radius-2xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, list.map(t => /*#__PURE__*/React.createElement(TutorCard, _extends({
    key: t.name
  }, t, {
    onView: () => onBook(t)
  }))))));
}
const GROUPS = [{
  name: 'CSEC Maths Intensive — Paper 2 Drills',
  subjects: ['Mathematics'],
  tutorName: 'Kavita Singh',
  rating: 4.8,
  reviewCount: 19,
  members: 12,
  nextSession: 'Sep 4',
  length: '1.5 hrs',
  price: 250,
  spotsLeft: 3,
  membership: 'approved'
}, {
  name: 'CAPE Biology Study Circle',
  subjects: ['Biology', 'CAPE'],
  tutorName: 'Anisa Mohammed',
  rating: 4.9,
  reviewCount: 42,
  members: 8,
  nextSession: 'Sep 6',
  length: '1 hr',
  price: null,
  coverGradient: 'linear-gradient(135deg,#818cf8,#4f46e5)',
  membership: 'approved'
}, {
  name: 'SEA Prep Saturdays',
  subjects: ['SEA Preparation'],
  tutorName: 'Shivani Bahadur',
  rating: 5,
  reviewCount: 8,
  members: 22,
  nextSession: null,
  length: '2 hrs',
  price: 180,
  priceSuffix: '/session',
  fillingFast: true,
  coverGradient: 'linear-gradient(135deg,#fbbf24,#f97316)',
  membership: 'pending'
}];
function Classes() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#111827'
    }
  }, "My Classes"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: '#6b7280'
    }
  }, "Group classes you\u2019ve joined or requested.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, GROUPS.map(g => /*#__PURE__*/React.createElement(GroupCard, _extends({
    key: g.name
  }, g)))));
}
function BookingModal({
  tutor,
  onClose,
  onConfirm
}) {
  const slots = ['Tue 2 Sep · 4:00 PM', 'Wed 3 Sep · 5:30 PM', 'Sat 6 Sep · 10:00 AM'];
  const [slot, setSlot] = React.useState(slots[0]);
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Request a session",
    size: "lg",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: onConfirm
    }, "Send request"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: tutor.name,
    size: 48,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)',
      color: '#111827'
    }
  }, tutor.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#6b7280'
    }
  }, '$' + tutor.price + '.00/hr TTD · ' + tutor.subjects[0]))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: '#374151'
    }
  }, "Pick a time"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginBottom: 20
    }
  }, slots.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setSlot(s),
    style: {
      textAlign: 'left',
      padding: '12px 14px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      background: slot === s ? '#f0fdf4' : '#fff',
      border: '1px solid ' + (slot === s ? 'var(--itutor-green)' : 'var(--surface-border)'),
      color: '#111827'
    }
  }, s))), /*#__PURE__*/React.createElement(Input, {
    label: "Note for your tutor (optional)",
    placeholder: "Topics you want to cover\u2026"
  }));
}
Object.assign(window, {
  Dashboard,
  Explore,
  Classes,
  BookingModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/student-app/StudentScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/student-app/StudentShellView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SidebarNavItem,
  SearchField,
  Icon,
  Avatar
} = window.ITutorDesignSystem_e4581d;
const NAV = [{
  label: 'Home',
  icon: 'layout-dashboard',
  tint: {
    bg: 'rgba(16,185,129,0.2)',
    fg: '#6ee7b7',
    ring: 'rgba(52,211,153,0.3)'
  }
}, {
  label: 'Explore',
  icon: 'search',
  tint: {
    bg: 'rgba(244,63,94,0.2)',
    fg: '#fda4af',
    ring: 'rgba(251,113,133,0.3)'
  }
}, {
  label: 'My Classes',
  icon: 'graduation-cap',
  tint: {
    bg: 'rgba(14,165,233,0.2)',
    fg: '#7dd3fc',
    ring: 'rgba(56,189,248,0.3)'
  }
}, {
  label: 'My Bookings',
  icon: 'calendar-days',
  tint: {
    bg: 'rgba(245,158,11,0.2)',
    fg: '#fcd34d',
    ring: 'rgba(251,191,36,0.3)'
  }
}, {
  label: 'Subscriptions',
  icon: 'credit-card',
  tint: {
    bg: 'rgba(168,85,247,0.2)',
    fg: '#d8b4fe',
    ring: 'rgba(192,132,252,0.3)'
  }
}, {
  label: 'Transactions',
  icon: 'receipt-text',
  tint: {
    bg: 'rgba(16,185,129,0.2)',
    fg: '#6ee7b7',
    ring: 'rgba(52,211,153,0.3)'
  }
}, {
  label: 'Tools',
  icon: 'wrench',
  tint: {
    bg: 'rgba(139,92,246,0.2)',
    fg: '#c4b5fd',
    ring: 'rgba(167,139,250,0.3)'
  }
}];
function StudentShell({
  active,
  onNavigate,
  children,
  studentName = 'Maya',
  studentFullName
}) {
  const fullName = studentFullName || studentName + ' Persad';
  const [collapsed, setCollapsed] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      overflow: 'hidden',
      background: 'var(--background)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    className: "dark",
    style: {
      width: collapsed ? 64 : 256,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      background: 'var(--ink)',
      transition: 'width var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '16px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      justifyContent: collapsed ? 'center' : 'flex-start'
    }
  }, collapsed ? /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-mark.png",
    alt: "iTutor",
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-logo-dark.png",
    alt: "iTutor",
    style: {
      height: 32,
      flex: 1,
      objectFit: 'contain',
      objectPosition: 'left'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCollapsed(c => !c),
    title: collapsed ? 'Expand' : 'Collapse',
    style: {
      width: 32,
      height: 32,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      border: 'none',
      background: 'transparent',
      color: 'var(--muted-foreground)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: collapsed ? 'panel-left-open' : 'panel-left-close',
    size: 16
  }))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: '8px 12px',
      display: 'grid',
      gap: 2,
      alignContent: 'start'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement(SidebarNavItem, _extends({
    key: n.label
  }, n, {
    collapsed: collapsed,
    active: active === n.label,
    onClick: () => onNavigate(n.label)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: fullName,
    size: 36,
    hue: 40
  }), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#fff'
    }
  }, fullName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Student")), !collapsed && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-up",
    size: 16,
    color: "rgba(255,255,255,0.6)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--topbar-h)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 576
    }
  }, /*#__PURE__*/React.createElement(SearchField, null)), ['bell', 'settings'].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '9999px',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: i,
    size: 16
  }))))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: 32
    }
  }, children)));
}
Object.assign(window, {
  StudentShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/student-app/StudentShellView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/student-app/StudentSpec.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  StarRating,
  SubjectPill,
  Input,
  VerifiedBadge,
  Modal
} = window.ITutorDesignSystem_e4581d;

/* Student surface, §4. Aaliyah Ramkissoon is a dependent student — parent Priya
   linked on 2 Jul 2026 — so her requests need approval and reach no checkout.
   Josiah's twin case (self-paying) is shown by the toggle on the booking request. */

const STUDENT = {
  name: 'Aaliyah Ramkissoon',
  short: 'Aaliyah',
  form: 'Form 5',
  parent: 'Priya Ramkissoon',
  color: '#9333EA'
};

/* attendance vocabulary is character-identical to the parent and tutor kits */
const ATT = {
  attended: {
    label: 'Attended',
    icon: 'check',
    bg: 'rgba(25,147,86,0.1)',
    fg: 'var(--itutor-green)'
  },
  late: {
    label: 'Late',
    icon: 'clock',
    bg: '#fffbeb',
    fg: '#b45309'
  },
  absent: {
    label: 'Absent',
    icon: 'x',
    bg: '#fef2f2',
    fg: '#dc2626'
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'ban',
    bg: 'var(--neutral-bg)',
    fg: '#6b7280'
  }
};

/* same array as CHILDREN.c1.history in the parent kit — 92% of 12 sessions */
const MY_ATTENDANCE = ['attended', 'absent', 'attended', 'cancelled', 'attended', 'attended', 'late', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended'];
const PENDING = [{
  id: 'p1',
  title: 'CSEC Mathematics — Paper 2 Drills',
  tutor: 'Anisa Mohammed',
  requested: '4 Sep 2026',
  priceWhenRequested: 180,
  closesAt: 'Sat 6 Sep, 8:00 AM',
  state: 'pending'
}, {
  id: 'p2',
  title: 'SEA Maths Clinic — free community class',
  tutor: 'Anisa Mohammed',
  requested: '5 Sep 2026',
  priceWhenRequested: 0,
  closesAt: 'Wed 10 Sep, 4:00 PM',
  state: 'pending'
}, {
  id: 'p3',
  title: 'CAPE Chemistry — Organic revision',
  tutor: 'Kavita Singh',
  requested: '19 Aug 2026',
  priceWhenRequested: 120,
  closesAt: 'Thu 21 Aug, 3:00 PM',
  state: 'expired'
}];
const TUTOR_CARDS = [{
  tutor: 'Anisa Mohammed',
  avatar: '../../assets/team/liam-rampersad.jpg',
  subject: 'CSEC Mathematics',
  via: 'CSEC Mathematics 1:1',
  rating: 4.9,
  count: 42,
  quota: {
    used: true,
    by: 'parent',
    on: '4 Sep'
  }
}, {
  tutor: 'Kavita Singh',
  avatar: '../../assets/team/jovan-goodluck.jpg',
  subject: 'CAPE Chemistry',
  via: 'Maths & Science group class',
  rating: 4.8,
  count: 27,
  quota: {
    used: false
  }
}];
const money = n => '$' + Number(n).toLocaleString() + ' TTD';
function Dot({
  color,
  size = 8
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: color,
      flexShrink: 0,
      display: 'inline-block'
    }
  });
}
function Title({
  children,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, children), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, sub)), right);
}

/* ── 4.1 Booking request ─────────────────────────────────────────────── */
/* Dependent: no card fields, no checkout, price visible but framed as the
   parent's payment. The seat warning and closing time are both mandatory. */
function BookingRequestModal({
  dependent,
  onClose,
  onSend
}) {
  const cls = {
    title: 'CSEC Mathematics — Paper 2 Drills',
    tutor: 'Anisa Mohammed',
    when: 'Sat 6 Sep · 10:00 AM',
    minutes: 90,
    price: 180,
    closesAt: 'Sat 6 Sep, 8:00 AM'
  };
  return /*#__PURE__*/React.createElement(Modal, {
    title: dependent ? 'Ask your parent to book this' : 'Book this class',
    size: "md",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: onSend
    }, dependent ? 'Send request to ' + STUDENT.parent.split(' ')[0] : 'Continue to payment'))
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "inset",
    padding: "16px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, cls.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)',
      marginTop: 2
    }
  }, cls.tutor, " \xB7 ", cls.when, " \xB7 ", cls.minutes, " min"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTop: '1px solid #e5e7eb'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, money(cls.price)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#6b7280'
    }
  }, dependent ? 'your parent will be asked to pay this' : 'you pay this'))), dependent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      marginTop: 14,
      padding: '12px 14px',
      background: '#fffbeb',
      border: '1px solid #fde68a',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 16,
    color: "#b45309"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#78350f'
    }
  }, "This spot isn\u2019t reserved until your parent pays."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#78350f',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Someone else can take the last place while you wait."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginTop: 10,
      padding: '12px 14px',
      background: 'var(--surface-inset)',
      border: '1px solid #e5e7eb',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16,
    color: "#6b7280"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, STUDENT.parent, " has until ", /*#__PURE__*/React.createElement("strong", null, cls.closesAt), " \u2014 two hours before the class starts. After that the request closes on its own.")), /*#__PURE__*/React.createElement(Input, {
    label: "Add a note for your parent (optional)",
    placeholder: "Miss said this is the one before the mock.",
    style: {
      marginTop: 14
    }
  })) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '14px 0 0',
      fontSize: 'var(--text-sm)',
      color: '#4b5563',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "You\u2019ll finish on Stripe\u2019s secure page. Your place is confirmed as soon as payment clears \u2014 not before."));
}

/* ── 4.2 Pending requests + 4.3 tutor cards ──────────────────────────── */
function MyClasses({
  onRequest,
  onMessages,
  onOpenClass
}) {
  const [pending, setPending] = React.useState(PENDING);
  const [note, setNote] = React.useState(null);
  const flash = m => {
    setNote(m);
    setTimeout(() => setNote(null), 2800);
  };
  const withdraw = id => {
    setPending(p => p.filter(x => x.id !== id));
    flash('Withdrawn — it has been removed from your parent\u2019s queue.');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 24,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(Title, {
    sub: "Requests waiting on your parent, then everything you are enrolled in."
  }, "My Classes"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "Waiting on your parent"), pending.filter(p => p.state === 'pending').length > 0 && /*#__PURE__*/React.createElement(Badge, {
    tone: "amber"
  }, pending.filter(p => p.state === 'pending').length, " pending")), pending.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-sm)',
      color: '#4b5563'
    }
  }, "Nothing waiting. When you ask to join a class, it appears here until ", STUDENT.parent.split(' ')[0], " approves it."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onRequest
  }, "Find a class")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, pending.map(p => {
    const expired = p.state === 'expired';
    const free = p.priceWhenRequested === 0;
    return /*#__PURE__*/React.createElement(Card, {
      key: p.id,
      padding: "18px",
      hoverLift: false,
      style: {
        borderLeft: '4px solid ' + (expired ? '#d1d5db' : '#f59e0b'),
        opacity: expired ? 0.85 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 280
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--ink)'
      }
    }, p.title), /*#__PURE__*/React.createElement(Badge, {
      tone: expired ? 'neutral' : 'amber'
    }, expired ? 'Expired' : 'Awaiting approval')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, p.tutor, " \xB7 requested ", p.requested, " \xB7 ", free ? 'Free class' : money(p.priceWhenRequested) + ' as listed when you asked'), expired ? /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontSize: 'var(--text-xs)',
        color: '#6b7280',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Closed unanswered at ", p.closesAt, ". The place went to another student. Ask again if you still want it.") : /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontSize: 'var(--text-xs)',
        color: '#78350f',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "This spot isn\u2019t reserved until your parent pays."), " Closes ", p.closesAt, ".")), expired ? /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: onRequest
    }, "Ask again") : /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => withdraw(p.id)
    }, "Withdraw")));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      marginBottom: 10
    }
  }, "Enrolled"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, [{
    name: 'CSEC Mathematics 1:1',
    tutor: 'Anisa Mohammed',
    pattern: 'Tuesdays & Saturdays',
    next: 'Today · 4:00 PM'
  }, {
    name: 'Maths & Science group class',
    tutor: 'Kavita Singh',
    pattern: 'Sundays, 2:00 PM',
    next: 'Sun 7 Sep'
  }].map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.name,
    padding: "18px",
    onClick: onOpenClass
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-lg)',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(147,51,234,0.12)',
      color: '#7c3aed'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book-open",
    size: 17
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, c.tutor, " \xB7 ", c.pattern)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, "Next: ", c.next), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "#9ca3af"
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)',
      marginBottom: 4
    }
  }, "Your tutors"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "You and ", STUDENT.parent.split(' ')[0], " share one feedback request a month."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 16
    }
  }, TUTOR_CARDS.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.tutor,
    padding: "20px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: t.avatar,
    name: t.tutor,
    size: 44,
    rounded: "2xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, t.tutor), /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, t.subject), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(StarRating, {
    value: t.rating,
    count: t.count,
    size: 12
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 11,
      color: '#6b7280'
    }
  }, "Through ", /*#__PURE__*/React.createElement("strong", null, t.via)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    disabled: t.quota.used,
    onClick: () => flash('Requested — ' + t.tutor + ' will answer when they can.')
  }, t.quota.used ? 'Feedback requested' : 'Request feedback'), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onMessages
  }, "Message tutor")), t.quota.used && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 11,
      color: '#9ca3af',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Your parent requested feedback on ", t.quota.on, ". You share one request a month \u2014 the next opens in October."))))), note && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 60,
      background: 'var(--ink)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 'var(--radius-lg)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      boxShadow: 'var(--shadow-card)'
    }
  }, note));
}

/* ── 4.4 Attendance in the class view ────────────────────────────────── */
function ClassView({
  onBack
}) {
  const t = {
    attended: 0,
    late: 0,
    absent: 0,
    cancelled: 0
  };
  MY_ATTENDANCE.forEach(s => {
    t[s] += 1;
  });
  const counted = t.attended + t.late + t.absent;
  const rate = Math.round((t.attended + t.late) / counted * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " My Classes"), /*#__PURE__*/React.createElement(Title, {
    sub: "Anisa Mohammed \xB7 Tuesdays & Saturdays"
  }, "CSEC Mathematics 1:1"), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Your attendance"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect"
  }, "Automatic \xB7 not editable")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1,
      color: rate >= 90 ? 'var(--itutor-green)' : rate >= 75 ? '#b45309' : '#dc2626',
      fontVariantNumeric: 'tabular-nums'
    }
  }, rate, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, "of ", counted, " sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(13,1fr)',
      gap: 6,
      maxWidth: 460
    }
  }, MY_ATTENDANCE.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    title: ATT[s].label,
    style: {
      height: 30,
      borderRadius: 6,
      background: ATT[s].fg,
      opacity: s === 'cancelled' ? 0.3 : 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      marginTop: 14
    }
  }, ['attended', 'late', 'absent', 'cancelled'].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 9999,
      background: ATT[k].fg,
      opacity: k === 'cancelled' ? 0.35 : 1
    }
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, t[k]), " ", ATT[k].label.toLowerCase()))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 'var(--text-xs)',
      color: '#9ca3af',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Recorded when you click Join. Arriving after the start time counts as late. Cancelled sessions don\u2019t count against you.")), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 8px',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Sessions"), [['Sat 30 Aug · 10:00 AM', 'attended'], ['Tue 26 Aug · 4:00 PM', 'attended'], ['Sat 23 Aug · 10:00 AM', 'late'], ['Tue 19 Aug · 4:00 PM', 'cancelled']].map(([when, st], i) => /*#__PURE__*/React.createElement("div", {
    key: when,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 20px',
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-sm)',
      color: '#374151'
    }
  }, when), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 10px',
      borderRadius: 9999,
      background: ATT[st].bg,
      color: ATT[st].fg,
      fontSize: 11,
      fontWeight: 'var(--weight-bold)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ATT[st].icon,
    size: 11,
    strokeWidth: 3
  }), ATT[st].label, st === 'late' ? ' · 12 min' : '')))));
}

/* ── 4.5 Messaging disclosure ────────────────────────────────────────── */
/* Persistent and non-dismissible, and present only because a parent is linked. */
function StudentMessages({
  onBack
}) {
  const [draft, setDraft] = React.useState('');
  const [sent, setSent] = React.useState([]);
  const msgs = [{
    from: 'student',
    at: '29 Aug, 3:12 PM',
    text: 'Miss, is Saturday\u2019s class paper 2 only or both papers?'
  }, {
    from: 'tutor',
    at: '29 Aug, 4:40 PM',
    text: 'Paper 2 only. Bring the Jun 2023 paper, we\u2019ll mark it together.'
  }, {
    from: 'student',
    at: '29 Aug, 4:44 PM',
    text: 'Ok. I couldn\u2019t finish question 4.'
  }, {
    from: 'tutor',
    at: '29 Aug, 5:01 PM',
    text: 'That\u2019s the one we\u2019ll start with then. Don\u2019t worry about finishing it tonight.'
  }].concat(sent);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " My Classes"), /*#__PURE__*/React.createElement(Title, {
    sub: "Anisa Mohammed \xB7 CSEC Mathematics"
  }, "Messages"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'rgba(14,165,233,0.08)',
      border: '1px solid rgba(14,165,233,0.25)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "eye",
    size: 16,
    color: "#0369a1"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#0c4a6e',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, STUDENT.parent, " can read this conversation."), " Messages from 2 Jul 2026 onward are visible to your linked parent.")), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false,
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: 480
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 16,
      borderBottom: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: "../../assets/team/liam-rampersad.jpg",
    name: "Anisa Mohammed",
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Anisa Mohammed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "CSEC Mathematics"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'grid',
      gap: 12,
      alignContent: 'start',
      background: 'var(--surface-inset)'
    }
  }, msgs.map((m, i) => {
    const mine = m.from === 'student';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '72%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        background: mine ? 'var(--itutor-green)' : '#fff',
        color: mine ? '#fff' : '#374151',
        border: mine ? 'none' : '1px solid #e5e7eb',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: '#9ca3af',
        textAlign: mine ? 'right' : 'left'
      }
    }, m.at)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 12,
      borderTop: '1px solid #f3f4f6',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Message Anisa\u2026",
    value: draft,
    onChange: e => setDraft(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      if (draft.trim()) {
        setSent(s => s.concat({
          from: 'student',
          at: 'Just now',
          text: draft
        }));
        setDraft('');
      }
    },
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 14,
      color: "#fff"
    })
  }, "Send"))));
}

/* ── Explore, so the request modal has somewhere to open from ─────────── */
function ExploreSpec({
  onOpen,
  dependent,
  onToggle
}) {
  const items = [{
    title: 'CSEC Mathematics — Paper 2 Drills',
    tutor: 'Anisa Mohammed',
    form: 'Form 4',
    when: 'Saturdays · 10:00 AM',
    price: 180,
    seats: '3 of 12 places left'
  }, {
    title: 'CAPE Chemistry — Unit 1 revision',
    tutor: 'Kavita Singh',
    form: 'Form 6',
    when: 'Sundays · 2:00 PM',
    price: 300,
    seats: '6 of 10 places left'
  }, {
    title: 'SEA Maths Clinic',
    tutor: 'Anisa Mohammed',
    form: 'Std 5',
    when: 'Wednesdays · 6:00 PM',
    price: 0,
    seats: 'Free · open'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(Title, {
    sub: "Every student sees prices, whether or not a parent pays them.",
    right: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: onToggle
    }, dependent ? 'Preview as self-paying' : 'Preview as parent-linked')
  }, "Explore"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, items.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.title,
    padding: "18px",
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: l.tutor,
    size: 36,
    hue: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, l.tutor, " ", /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, l.form))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)',
      letterSpacing: 0,
      marginBottom: 6
    }
  }, l.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, l.when), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: 'var(--ink)'
    }
  }, l.price ? money(l.price) : 'Free'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, l.seats))))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, dependent ? 'You are linked to ' + STUDENT.parent + ', so joining a class sends a request instead of taking payment.' : 'You pay for your own classes, so joining goes straight to checkout.'));
}
Object.assign(window, {
  BookingRequestModal,
  MyClasses,
  ClassView,
  StudentMessages,
  ExploreSpec,
  STUDENT
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/student-app/StudentSpec.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/AIBadges.jsx
try { (() => {
/* Cross-cutting badge system for the three iTutor AI v2 tools.
   One registry, three tools. Provenance, plan status, marking status and
   review state all resolve through BADGES so nothing is styled ad hoc. */
const {
  Icon
} = window.ITutorDesignSystem_e4581d;
const OUTLINE = c => ({
  background: '#fff',
  color: c,
  border: '1px solid ' + c
});
const FILL = (bg, fg) => ({
  background: bg,
  color: fg,
  border: '1px solid transparent'
});
const CORAL = 'oklch(0.58 0.16 40)';
const BADGES = {
  /* provenance — Past Paper Desk, always visible on a question */
  specimen: {
    label: 'Official Specimen',
    icon: 'shield-check',
    ...OUTLINE('#0f7a44')
  },
  licensed: {
    label: 'Licensed Past Paper',
    icon: 'file-badge',
    ...FILL('var(--itutor-green)', '#fff')
  },
  generated: {
    label: 'iTutor Generated',
    icon: 'sparkles',
    ...OUTLINE(CORAL)
  },
  unreviewed: {
    label: 'AI-generated, unreviewed',
    icon: 'sparkles',
    ...FILL('var(--coral-soft)', CORAL)
  },
  authored: {
    label: 'Tutor Authored',
    icon: 'pen-line',
    ...FILL('var(--neutral-bg)', 'var(--neutral-fg)')
  },
  /* plan status — Lesson Planner */
  planned: {
    label: 'Planned',
    icon: null,
    ...FILL('var(--neutral-bg)', 'var(--neutral-fg)')
  },
  in_progress: {
    label: 'In Progress',
    icon: null,
    ...FILL('var(--itutor-green)', '#fff')
  },
  completed: {
    label: 'Completed',
    icon: 'check',
    ...FILL('rgba(25,147,86,0.12)', '#0f7a44')
  },
  skipped: {
    label: 'Skipped',
    icon: null,
    ...FILL('transparent', '#9ca3af'),
    strike: true
  },
  /* marking status — Marking Desk */
  queued: {
    label: 'Queued',
    icon: 'clock',
    ...FILL('var(--neutral-bg)', 'var(--neutral-fg)')
  },
  marking: {
    label: 'Marking',
    icon: 'loader',
    ...FILL('var(--progress-bg)', 'var(--progress-fg)')
  },
  done: {
    label: 'Done',
    icon: 'check',
    ...FILL('rgba(25,147,86,0.12)', '#0f7a44')
  },
  failed: {
    label: 'Failed',
    icon: 'alert-circle',
    ...FILL('var(--danger-bg)', 'var(--danger-fg)')
  },
  published: {
    label: 'Published',
    icon: 'send',
    ...FILL('var(--itutor-green)', '#fff')
  },
  /* review state — Marking Desk, and reused for weak areas in the Planner */
  ai_suggested: {
    label: 'AI suggested',
    icon: 'sparkles',
    ...OUTLINE(CORAL)
  },
  tutor_confirmed: {
    label: 'Tutor confirmed',
    icon: 'check',
    ...FILL('rgba(25,147,86,0.12)', '#0f7a44')
  },
  weak: {
    label: 'Weak area',
    icon: 'target',
    ...FILL('var(--coral-soft)', CORAL)
  }
};
function AIBadge({
  kind,
  label,
  size = 'md',
  icon,
  style
}) {
  const b = BADGES[kind] || BADGES.planned;
  const sm = size === 'sm';
  const glyph = icon === null ? null : icon || b.icon;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sm ? 3 : 5,
      whiteSpace: 'nowrap',
      padding: sm ? '2px 7px' : '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: sm ? 'var(--text-2xs)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      lineHeight: 1.5,
      textDecoration: b.strike ? 'line-through' : 'none',
      background: b.background,
      color: b.color,
      border: b.border,
      ...style
    }
  }, glyph && /*#__PURE__*/React.createElement(Icon, {
    name: glyph,
    size: sm ? 10 : 12
  }), label || b.label);
}
Object.assign(window, {
  AIBadge,
  AI_BADGES: BADGES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/AIBadges.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/ClientsView.jsx
try { (() => {
const {
  Card,
  Button,
  Icon,
  Avatar,
  Input,
  Badge
} = window.ITutorDesignSystem_e4581d;

/* §5.5 Clients — the tutor's view of one class. Everything a tutor needs about a
   student sits in one card: who they are, who their parent is (if linked), how to
   reach either one, and the single feedback action. Feedback is monthly-quota'd,
   so the button carries three states and the card must make the current one
   unmistakable without shouting. */

const MONTH = 'September';
const CLIENTS = [{
  id: 'st1',
  name: 'Aaliyah Ramkissoon',
  form: 'Form 5',
  avatar: null,
  parent: {
    name: 'Priya Ramkissoon',
    avatar: '../../assets/team/liam-rampersad.jpg'
  },
  joined: 'Joined 12 Aug',
  rate: 92,
  sessions: 13,
  feedback: {
    state: 'requested',
    on: '4 Sep',
    by: 'parent'
  }
}, {
  id: 'st2',
  name: 'Josiah Ramkissoon',
  form: 'Form 3',
  avatar: null,
  parent: {
    name: 'Priya Ramkissoon',
    avatar: '../../assets/team/liam-rampersad.jpg'
  },
  joined: 'Joined 12 Aug',
  rate: 73,
  sessions: 11,
  feedback: {
    state: 'sent',
    on: '6 Sep'
  }
}, {
  id: 'st3',
  name: 'Deneisha Baptiste',
  form: 'Form 5',
  avatar: null,
  parent: null,
  joined: 'Joined 19 Aug',
  rate: 100,
  sessions: 10,
  feedback: {
    state: 'requested',
    on: '2 Sep',
    by: 'student'
  }
}, {
  id: 'st4',
  name: 'Kwesi Charles',
  form: 'Form 4',
  avatar: null,
  parent: null,
  joined: 'Joined 23 Aug',
  rate: 67,
  sessions: 10,
  feedback: {
    state: 'open'
  }
}];

/* ── the one action, three states ─────────────────────────────────────── */
/* open      → plain invitation, no urgency
   requested → someone is waiting; this is the only thing in the card allowed to
               use the purple request colour
   sent      → spent for the month, and says when it comes back */
function FeedbackAction({
  c,
  onFeedback
}) {
  const f = c.feedback;
  if (f.state === 'sent') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '9px 15px',
        borderRadius: 9999,
        background: 'rgba(25,147,86,0.09)',
        border: '1px solid rgba(25,147,86,0.28)',
        color: '#0f7a44',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-bold)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check-circle-2",
      size: 14
    }), " Feedback sent ", f.on), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#9ca3af'
      }
    }, "One per month \u2014 next available 1 Oct."));
  }
  if (f.state === 'requested') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => onFeedback(c),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "message-square-quote",
        size: 14,
        color: "#fff"
      })
    }, "Give feedback"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 11px',
        borderRadius: 9999,
        background: 'rgba(147,51,234,0.09)',
        border: '1px solid rgba(147,51,234,0.28)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "hand",
      size: 12,
      color: "#7c3aed"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 'var(--weight-bold)',
        color: '#6b21a8'
      }
    }, "Requested ", f.on), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#7c3aed'
      }
    }, "by ", f.by)));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => onFeedback(c),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-square-plus",
      size: 14
    })
  }, "Give feedback"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, "Nobody asked \u2014 optional, one per month."));
}

/* ── the slim parent bar ──────────────────────────────────────────────── */
/* Sits under the student, inset and tinted, so the hierarchy reads
   student-then-parent at a glance. Name only, and one action: message. */
function ParentBar({
  parent,
  onMessage
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
      padding: '8px 10px 8px 12px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-inset)',
      border: '1px solid #eceff2'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#9ca3af'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link-2",
    size: 11
  }), " Parent"), /*#__PURE__*/React.createElement(Avatar, {
    src: parent.avatar,
    name: parent.name,
    size: 24
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, parent.name), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onMessage,
    title: 'Message ' + parent.name,
    "aria-label": 'Message ' + parent.name,
    className: "cl-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 15
  })));
}
function ClientCard({
  c,
  onFeedback,
  onMessage
}) {
  const first = c.name.split(' ')[0];
  return /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: c.avatar,
    name: c.name,
    size: 46,
    rounded: "2xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, c.form), !c.parent && /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect"
  }, "No parent linked")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Attendance ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.rate, "%"), " of ", c.sessions), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9ca3af'
    }
  }, c.joined))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => onMessage(c, 'student'),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 14
    })
  }, "Message ", first)), c.parent && /*#__PURE__*/React.createElement(ParentBar, {
    parent: c.parent,
    onMessage: () => onMessage(c, 'parent')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      borderTop: '1px solid #f3f4f6',
      background: '#fcfdfc',
      borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
    }
  }, /*#__PURE__*/React.createElement(FeedbackAction, {
    c: c,
    onFeedback: onFeedback
  })));
}
function ClientsScreen({
  onFeedback,
  onMessage
}) {
  const [filter, setFilter] = React.useState('All');
  const open = CLIENTS.filter(c => c.feedback.state === 'requested').length;
  const done = CLIENTS.filter(c => c.feedback.state === 'sent').length;
  const shown = (filter === 'Requests open' ? CLIENTS.filter(c => c.feedback.state === 'requested') : filter === 'Feedback given' ? CLIENTS.filter(c => c.feedback.state === 'sent') : CLIENTS).slice().sort((a, b) => (b.feedback.state === 'requested' ? 1 : 0) - (a.feedback.state === 'requested' ? 1 : 0));
  const FILTERS = [['All', CLIENTS.length], ['Requests open', open], ['Feedback given', done]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book-open",
    size: 13
  }), " CSEC Mathematics \u2014 Paper 2 Drills"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '6px 0 0',
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "Clients"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      maxWidth: 620,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Everyone in this class. Where a parent account is linked, they sit with the student \u2014 you can message either one. Feedback is one per student per month; ", MONTH, "\u2019s quota resets 1 Oct.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, FILTERS.map(([f, n]) => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    className: "cl-chip",
    "data-active": filter === f ? '1' : '0'
  }, f, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, " \xB7 ", n)))), shown.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    padding: "28px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Nothing here"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#6b7280'
    }
  }, "No student in this class matches that filter."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      marginTop: 14
    },
    onClick: () => setFilter('All')
  }, "Show everyone")) : shown.map(c => /*#__PURE__*/React.createElement(ClientCard, {
    key: c.id,
    c: c,
    onFeedback: onFeedback,
    onMessage: onMessage
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: '#9ca3af',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Requests sort first. Attendance is recorded automatically and cannot be changed by anyone."));
}

/* ── messaging, addressed to whoever the tutor picked ─────────────────── */
function ClientThread({
  client,
  to,
  onBack
}) {
  const c = client || CLIENTS[0];
  const toParent = to === 'parent' && c.parent;
  const who = toParent ? c.parent.name : c.name;
  const [draft, setDraft] = React.useState('');
  const [sent, setSent] = React.useState([]);
  const base = toParent ? [{
    from: 'them',
    at: '22 Aug, 8:30 PM',
    text: 'Josiah was late again — that\u2019s on us, traffic from San Fernando. Could we move him to 6:00 PM?'
  }, {
    from: 'me',
    at: '23 Aug, 9:02 AM',
    text: '6:00 PM works better for me too. I\u2019ve moved the recurring slot.'
  }] : [{
    from: 'them',
    at: '2 Sep, 7:14 PM',
    text: 'Miss, could you look at my working for question 5?'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "cl-back"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Back to clients"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, who), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, toParent ? 'Parent of ' + c.name : c.form + ' · student', " \xB7 CSEC Mathematics \u2014 Paper 2 Drills")), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false,
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: 440
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'grid',
      gap: 12,
      alignContent: 'start',
      background: 'var(--surface-inset)'
    }
  }, base.concat(sent).map((m, i) => {
    const mine = m.from === 'me';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '72%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        background: mine ? 'var(--itutor-green)' : '#fff',
        color: mine ? '#fff' : '#374151',
        border: mine ? 'none' : '1px solid #e5e7eb',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: '#9ca3af',
        textAlign: mine ? 'right' : 'left'
      }
    }, m.at)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 12,
      borderTop: '1px solid #f3f4f6',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: 'Message ' + who.split(' ')[0] + '…',
    value: draft,
    onChange: e => setDraft(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      if (draft.trim()) {
        setSent(x => x.concat({
          from: 'me',
          at: 'Just now',
          text: draft
        }));
        setDraft('');
      }
    },
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 14,
      color: "#fff"
    })
  }, "Send"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: '#9ca3af'
    }
  }, toParent ? 'This thread goes to the parent only. The student does not see it.' : 'This thread goes to ' + c.name.split(' ')[0] + ' only' + (c.parent ? '. The parent does not see it.' : ' — no parent account is linked.')));
}
Object.assign(window, {
  ClientsScreen,
  ClientCard,
  ClientThread,
  FeedbackAction,
  ParentBar,
  TUTOR_CLIENTS: CLIENTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/ClientsView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/CreateSessionFlow.jsx
try { (() => {
const {
  Icon,
  Button,
  Avatar,
  Badge
} = window.ITutorDesignSystem_e4581d;
const CLASSES = [{
  id: 'secure',
  name: '[TEST] Secure Spot Preview',
  price: 'TT$120/mo',
  subject: 'Mathematics',
  icon: 'shield-check',
  tint: 'var(--sky)'
}, {
  id: 'chem',
  name: 'Chemistry crash course',
  price: 'TT$4/mo',
  subject: 'Chemistry',
  icon: 'flask-conical',
  tint: 'var(--lavender)'
}, {
  id: 'algebra',
  name: 'Algebra Foundations',
  price: 'TT$5/mo',
  subject: 'Mathematics',
  icon: 'sigma',
  tint: 'var(--mint-deep)'
}, {
  id: 'writing',
  name: 'Creative Writing Club',
  price: 'TT$5/mo',
  subject: 'English',
  icon: 'pen-line',
  tint: 'var(--peach)'
}, {
  id: 'science',
  name: 'Junior Science Lab',
  price: 'TT$0/mo',
  subject: 'Science',
  icon: 'microscope',
  tint: 'var(--coral-soft)'
}, {
  id: 'history',
  name: 'Caribbean History Prep',
  price: 'TT$0/mo',
  subject: 'History',
  icon: 'landmark',
  tint: 'var(--mint)'
}];
const DURATIONS = [30, 45, 60, 90];
const HOLDS = ['Their first month', 'Their first 3 months', 'Their first 6 months', 'As long as they stay enrolled'];
const STEPS = [{
  n: 1,
  label: 'The session',
  hint: 'What families turn up to'
}, {
  n: 2,
  label: 'The reward',
  hint: 'What they unlock by coming'
}, {
  n: 3,
  label: 'Review',
  hint: 'One last look, then publish'
}];
const csRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12
};
const csLabel = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-h4)',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: 'var(--tracking-heading)',
  color: 'var(--ink)'
};
const csHint = {
  fontSize: 'var(--text-xs)',
  color: 'var(--text-subtle)',
  lineHeight: 1.5,
  textWrap: 'pretty'
};
const csField = {
  display: 'grid',
  gap: 8
};
function CSSection({
  label,
  hint,
  children,
  step
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: csRow
  }, step && /*#__PURE__*/React.createElement("span", {
    className: "cs-num"
  }, step), /*#__PURE__*/React.createElement("h3", {
    style: csLabel
  }, label)), hint && /*#__PURE__*/React.createElement("p", {
    style: {
      ...csHint,
      margin: 0,
      paddingLeft: step ? 36 : 0
    }
  }, hint)), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: step ? 36 : 0,
      display: 'grid',
      gap: 10
    }
  }, children));
}
function CSPill({
  active,
  onClick,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    className: "cs-pill",
    "data-active": active ? '1' : '0',
    style: style
  }, children);
}
function CSStepRail({
  current,
  onJump,
  preview
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 320,
      flexShrink: 0,
      background: 'var(--ink)',
      color: '#fff',
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      overflowY: 'auto',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--brand-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 12
  }), " Class Match Week"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h3)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 1.1
    }
  }, "Create a session")), /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 2
    }
  }, STEPS.map(s => {
    const state = current === s.n ? 'now' : current > s.n ? 'done' : 'todo';
    return /*#__PURE__*/React.createElement("li", {
      key: s.n
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onJump(s.n),
      className: "cs-step",
      "data-state": state
    }, /*#__PURE__*/React.createElement("span", {
      className: "cs-step-dot"
    }, state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 13
    }) : s.n), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'grid',
        gap: 1,
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)'
      }
    }, s.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.55)'
      }
    }, s.hint))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'grid',
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.45)'
    }
  }, "What families see"), preview));
}
function CSPreviewCard({
  name,
  cls,
  duration,
  when,
  discount,
  seats
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      color: 'var(--ink)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: '0 18px 40px -20px rgba(0,0,0,0.6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      background: 'linear-gradient(120deg,oklch(0.95 0.07 150),oklch(0.93 0.06 175))',
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: "../../assets/team/arjun-rambally.jpg",
    name: "Arjun Rambally",
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--forest)'
    }
  }, "Arjun Rambally"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 10,
      fontWeight: 'var(--weight-bold)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(255,255,255,0.75)',
      color: 'var(--brand-deep)'
    }
  }, "FREE TASTER")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      lineHeight: 1.2,
      minHeight: 20
    }
  }, name || /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(5,46,26,0.35)'
    }
  }, "Your session name appears here"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 14px',
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book-open",
    size: 11
  }), cls ? cls.name : 'Class TBC'), /*#__PURE__*/React.createElement("span", {
    className: "cs-meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11
  }), duration, " min"), /*#__PURE__*/React.createElement("span", {
    className: "cs-meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 11
  }), when || 'Date TBC'), /*#__PURE__*/React.createElement("span", {
    className: "cs-meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 11
  }), seats ? seats + ' seats' : 'Unlimited')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--mint)',
      border: '1px dashed color-mix(in oklab, var(--brand) 40%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-extrabold)',
      color: 'var(--brand-deep)'
    }
  }, discount, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      lineHeight: 1.35,
      color: 'var(--forest)'
    }
  }, "off if you enrol after turning up"))));
}
function CreateSessionFlow({
  onClose
}) {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState('');
  const [cls, setCls] = React.useState(null);
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [duration, setDuration] = React.useState(30);
  const [unlimited, setUnlimited] = React.useState(true);
  const [seats, setSeats] = React.useState(12);
  const [discount, setDiscount] = React.useState(10);
  const [covered, setCovered] = React.useState([]);
  const [hold, setHold] = React.useState(HOLDS[1]);
  const [days, setDays] = React.useState(16);
  const [ends, setEnds] = React.useState('');
  const [published, setPublished] = React.useState(false);
  const selected = CLASSES.find(c => c.id === cls) || null;
  const when = date ? new Date(date + 'T00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }) + (time ? ' · ' + time : '') : '';
  const step1Done = name.trim() && cls && date;
  const toggleCover = id => setCovered(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const coveredAll = selected ? [selected.id, ...covered.filter(c => c !== selected.id)] : covered;
  const nudge = step === 1 ? step1Done ? 'Looking good. Next: the reward.' : 'Name it, pick a class, pick a day.' : step === 2 ? 'Minimum 10%. Generous offers fill faster.' : 'Publish when it reads the way you want.';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      fontFamily: 'var(--font-sans)',
      display: 'grid',
      placeItems: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(9,20,14,0.55)',
      backdropFilter: 'blur(3px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 1060,
      height: 'min(88vh, 780px)',
      display: 'flex',
      background: '#fff',
      borderRadius: 28,
      overflow: 'hidden',
      boxShadow: '0 40px 90px -30px rgba(0,0,0,0.55)'
    }
  }, /*#__PURE__*/React.createElement(CSStepRail, {
    current: step,
    onJump: setStep,
    preview: /*#__PURE__*/React.createElement(CSPreviewCard, {
      name: name,
      cls: selected,
      duration: duration,
      when: when,
      discount: discount,
      seats: unlimited ? 0 : seats
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-soft)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '20px 28px 16px',
      background: '#fff',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, STEPS[step - 1].label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-subtle)',
      whiteSpace: 'nowrap'
    }
  }, "Step ", step, " of 3")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, STEPS.map(s => /*#__PURE__*/React.createElement("span", {
    key: s.n,
    style: {
      flex: 1,
      height: 5,
      borderRadius: 999,
      background: step >= s.n ? 'var(--brand)' : 'var(--border)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    className: "cs-close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px 28px 28px',
      display: 'grid',
      gap: 28,
      alignContent: 'start'
    }
  }, step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CSSection, {
    step: "1",
    label: "Name your session",
    hint: "Families see this name when they browse Class Match Week."
  }, /*#__PURE__*/React.createElement("input", {
    className: "cs-input cs-input-lg",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Meet your teacher: \u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, ['Meet your teacher: ', 'Try a lesson: ', 'Ask me anything: '].map(p => /*#__PURE__*/React.createElement(CSPill, {
    key: p,
    active: name.startsWith(p),
    onClick: () => setName(p)
  }, p.trim())))), /*#__PURE__*/React.createElement(CSSection, {
    step: "2",
    label: "Which class is this a taster for?",
    hint: "The taster's own class is always covered by the discount."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, CLASSES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    type: "button",
    onClick: () => setCls(c.id),
    className: "cs-card",
    "data-active": cls === c.id ? '1' : '0'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: c.tint,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--forest)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2,
      minWidth: 0,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-subtle)'
    }
  }, c.subject, " \xB7 ", c.price)), cls === c.id && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--brand-deep)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle-2",
    size: 16
  })))))), /*#__PURE__*/React.createElement(CSSection, {
    step: "3",
    label: "When is it?",
    hint: "Trinidad & Tobago time."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: csField
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-sub"
  }, "Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "cs-input",
    value: date,
    onChange: e => setDate(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: csField
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-sub"
  }, "Start time"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    className: "cs-input",
    value: time,
    onChange: e => setTime(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: csField
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-sub"
  }, "Duration"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, DURATIONS.map(d => /*#__PURE__*/React.createElement(CSPill, {
    key: d,
    active: duration === d,
    onClick: () => setDuration(d),
    style: {
      flex: 1
    }
  }, d, " min"))))), /*#__PURE__*/React.createElement(CSSection, {
    step: "4",
    label: "Maximum attendees",
    hint: "Students and parents together."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(CSPill, {
    active: unlimited,
    onClick: () => setUnlimited(true)
  }, "Unlimited"), /*#__PURE__*/React.createElement(CSPill, {
    active: !unlimited,
    onClick: () => setUnlimited(false)
  }, "Cap it"), !unlimited && /*#__PURE__*/React.createElement("div", {
    className: "cs-stepper"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSeats(s => Math.max(1, s - 1)),
    "aria-label": "Fewer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 14
  })), /*#__PURE__*/React.createElement("span", null, seats), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSeats(s => Math.min(200, s + 1)),
    "aria-label": "More"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  })))))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(120deg,var(--mint),oklch(0.95 0.05 175))',
      border: '1px solid color-mix(in oklab, var(--brand) 25%, transparent)',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: 'var(--brand)',
      color: '#fff',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gift",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--forest)'
    }
  }, "What attendees unlock"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--forest)',
      opacity: 0.75,
      lineHeight: 1.5
    }
  }, "A discount for the families who turn up, applied at checkout if they enrol."))), /*#__PURE__*/React.createElement(CSSection, {
    step: "1",
    label: "Discount",
    hint: "Minimum 10%."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-bigdial"
  }, /*#__PURE__*/React.createElement("span", null, discount), /*#__PURE__*/React.createElement("em", null, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "cs-range",
    min: "10",
    max: "50",
    step: "5",
    value: discount,
    onChange: e => setDiscount(+e.target.value),
    style: {
      '--cs-fill': (discount - 10) / 40 * 100 + '%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, [10, 15, 20, 25].map(d => /*#__PURE__*/React.createElement(CSPill, {
    key: d,
    active: discount === d,
    onClick: () => setDiscount(d),
    style: {
      flex: 1
    }
  }, d, "%")))))), /*#__PURE__*/React.createElement(CSSection, {
    step: "2",
    label: "Which classes the discount covers",
    hint: "Pick the taster's class above \u2014 it is always covered. Add other classes if you want an attendee to be able to spend the discount on any of them."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, CLASSES.map(c => {
    const locked = selected && selected.id === c.id;
    const on = locked || covered.includes(c.id);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      type: "button",
      disabled: locked,
      onClick: () => toggleCover(c.id),
      className: "cs-check",
      "data-active": on ? '1' : '0'
    }, /*#__PURE__*/React.createElement("span", {
      className: "cs-check-box"
    }, on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)',
        color: 'var(--ink)'
      }
    }, c.name), locked && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--brand-deep)',
        background: 'var(--brand-light)',
        padding: '3px 6px',
        borderRadius: 999
      }
    }, "Taster class"), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, c.price));
  }))), /*#__PURE__*/React.createElement(CSSection, {
    step: "3",
    label: "Discounted price holds for",
    hint: "Counted from the day they enrol, not from the day the class starts."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, HOLDS.map(h => /*#__PURE__*/React.createElement(CSPill, {
    key: h,
    active: hold === h,
    onClick: () => setHold(h)
  }, h)))), /*#__PURE__*/React.createElement(CSSection, {
    step: "4",
    label: "Days to claim it",
    hint: "Counted from the day each family attends, so everyone gets the same window."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-sub"
  }, "7 days"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--brand-deep)'
    }
  }, days, " days"), /*#__PURE__*/React.createElement("span", {
    className: "cs-sub"
  }, "30 days")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "cs-range",
    min: "7",
    max: "30",
    value: days,
    onChange: e => setDays(+e.target.value),
    style: {
      '--cs-fill': (days - 7) / 23 * 100 + '%'
    }
  }))), /*#__PURE__*/React.createElement(CSSection, {
    step: "5",
    label: "Offer ends (optional)",
    hint: "A hard deadline. Whichever comes first \u2014 this date or the days above \u2014 ends the offer. Leave blank to use the days alone."
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "cs-input",
    value: ends,
    onChange: e => setEnds(e.target.value),
    style: {
      maxWidth: 260
    }
  }))), step === 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CSSection, {
    label: "Read it back"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, [['Session', name || 'Not named yet', 'type'], ['Taster for', selected ? selected.name : 'No class picked', 'book-open'], ['When', (when || 'No date set') + ' · ' + duration + ' min', 'calendar'], ['Attendees', unlimited ? 'Unlimited' : seats + ' seats', 'users'], ['Discount', discount + '% off, held for ' + hold.replace('Their ', '').toLowerCase(), 'percent'], ['Covers', coveredAll.length ? coveredAll.length + (coveredAll.length === 1 ? ' class' : ' classes') : 'No classes yet', 'layers'], ['Claim window', days + ' days from attending' + (ends ? ', or ' + ends : ''), 'timer']].map(([k, v, icon]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-deep)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--text-subtle)',
      width: 110
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--ink)',
      fontWeight: 'var(--weight-medium)'
    }
  }, v))))), published && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--brand-light)',
      border: '1px solid color-mix(in oklab, var(--brand) 35%, transparent)',
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      background: 'var(--brand)',
      color: '#fff',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "party-popper",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--forest)'
    }
  }, "Published to Class Match Week"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--forest)',
      opacity: 0.75
    }
  }, "Families browsing 1 Sept \u2013 7 Sept can book it now."))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 28px',
      background: '#fff',
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-subtle)'
    }
  }, nudge), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md"
  }, "Save draft"), step < 3 ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    onClick: () => setStep(step + 1),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    })
  }, "Continue") : /*#__PURE__*/React.createElement(Button, {
    variant: "gradient",
    size: "md",
    onClick: () => setPublished(true),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 15
    })
  }, "Publish")))));
}
Object.assign(window, {
  CreateSessionFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/CreateSessionFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/PlannerData.jsx
try { (() => {
/* Sample plan: CSEC Mathematics, Form 5, exam 11 May 2027.
   Topics come from the CSEC Mathematics syllabus sections — the topic picker in
   Setup is a controlled list off SYLLABUS, never free text. */

const SYLLABUS = {
  'CSEC Mathematics': ['Number Theory & Computation', 'Consumer Arithmetic', 'Sets', 'Measurement', 'Statistics', 'Algebra', 'Relations, Functions & Graphs', 'Geometry & Trigonometry', 'Vectors & Matrices'],
  'CSEC Physics': ['Mechanics', 'Thermal Physics', 'Waves & Optics', 'Electricity & Magnetism', 'The Physics of the Atom'],
  'CSEC Chemistry': ['Principles of Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
  'CSEC Biology': ['Living Organisms & the Environment', 'Life Processes & Disease', 'Continuity & Variation'],
  'CAPE Pure Mathematics': ['Basic Algebra & Functions', 'Trigonometry & Plane Geometry', 'Calculus I', 'Calculus II', 'Sequences, Series & Approximations']
};
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* topic, sub-topics, objectives, homework, weak-area flag */
const PLAN_SEED = [['Number Theory & Computation', ['Place value', 'Fractions & decimals', 'Order of operations'], ['Convert between fractions, decimals and percentages', 'Apply order of operations to mixed expressions'], 'Worksheet 1A, questions 1–12. Bring a working calculator.', 0], ['Consumer Arithmetic', ['Hire purchase', 'Simple & compound interest'], ['Compute hire-purchase totals and deposits', 'Distinguish simple from compound interest'], 'Past paper set: three interest questions from the 2019 P2.', 0], ['Consumer Arithmetic', ['Utility bills', 'Salaries, wages & taxes'], ['Read a TTEC/WASA bill and compute the charge', 'Calculate net pay after NIS and PAYE'], 'Bring one real utility bill from home to work through.', 0], ['Sets', ['Set notation', 'Two-set Venn diagrams'], ['Use ∪, ∩, ⊂ and complement correctly', 'Shade regions of a two-set Venn diagram'], 'Worksheet 3A. Draw all eight shadings from memory.', 0], ['Sets', ['Three-set Venn diagrams', 'Word problems'], ['Translate a word problem into a Venn diagram', 'Solve for an unknown region algebraically'], 'Three-set problems, questions 4–9.', 0], ['Algebra', ['Laws of indices', 'Substitution'], ['Apply the four index laws including negative indices', 'Substitute values into algebraic formulae'], 'Indices drill — 20 questions, timed at 15 minutes.', 1], ['Algebra', ['Common factors', 'Grouping', 'Difference of two squares'], ['Factorise by grouping in four terms', 'Recognise and factorise a difference of two squares'], 'Factorisation ladder, all three tiers.', 1], ['Algebra', ['Linear equations', 'Linear inequalities', 'Number line'], ['Solve linear equations with brackets and fractions', 'Represent an inequality solution on a number line'], 'Worksheet 6B. Show every line of working.', 1], ['Algebra', ['Elimination', 'Substitution method'], ['Solve simultaneous linear equations by elimination', 'Choose the efficient method for a given pair'], 'Six simultaneous pairs, two by each method.', 0], ['Algebra', ['Factorising quadratics', 'Roots from factors'], ['Factorise quadratics with a leading coefficient of 1', 'State the roots from factorised form'], 'Quadratics A, questions 1–15.', 1], ['Algebra', ['Quadratic formula', 'Completing the square'], ['Apply the quadratic formula accurately', 'Complete the square to find a minimum value'], 'Quadratics B. Use the formula on all six.', 1], ['Relations, Functions & Graphs', ['Function notation', 'Mappings', 'Domain & range'], ['Read and write f(x) notation', 'State the domain and range of a mapping'], 'Notation worksheet, questions 1–10.', 0], ['Relations, Functions & Graphs', ['Gradient', 'Intercepts', 'Equation of a line'], ['Find the gradient from two points', 'Write the equation of a line in y = mx + c'], 'Plot four lines on graph paper from their equations.', 0], ['Relations, Functions & Graphs', ['Drawing quadratic graphs', 'Axis of symmetry', 'Maxima & minima'], ['Draw an accurate quadratic curve from a table', 'Read the maximum or minimum from a graph'], 'Full graph question from the 2021 P2.', 0], ['Relations, Functions & Graphs', ['Composite functions', 'Inverse functions'], ['Evaluate fg(x) and gf(x)', 'Find the inverse of a linear function'], 'Composite and inverse mixed set, 12 questions.', 0], ['Measurement', ['Perimeter', 'Area of compound shapes', 'Sectors & arcs'], ['Compute the area of a compound plane shape', 'Find arc length and sector area'], 'Compound area worksheet, questions 1–8.', 0], ['Measurement', ['Volume of prisms', 'Surface area', 'Capacity & units'], ['Compute the volume of a prism and a cylinder', 'Convert between cm³, litres and m³'], 'Volume set. Include the two cylinder questions.', 0], ['Geometry & Trigonometry', ['Angles in parallel lines', 'Polygons', 'Circle theorems'], ['Apply the circle theorems to find missing angles', 'Give a reason for every angle stated'], 'Circle theorem sheet — reasons required on all answers.', 0], ['Geometry & Trigonometry', ['Translation', 'Reflection', 'Rotation', 'Enlargement'], ['Describe a single transformation fully', 'Perform an enlargement about a given centre'], 'Transformation grid worksheet.', 0], ['Geometry & Trigonometry', ['Sine, cosine, tangent', 'Angles of elevation'], ['Select the correct ratio for a right-angled triangle', 'Solve an elevation problem with a diagram'], 'SOHCAHTOA drill, 18 questions.', 1], ['Geometry & Trigonometry', ['Sine rule', 'Cosine rule', 'Area of a triangle'], ['Apply the sine and cosine rules to non-right triangles', 'Compute triangle area with ½ab sin C'], 'Non-right triangle set, questions 1–10.', 1], ['Geometry & Trigonometry', ['Bearings', 'Three-figure notation', '3-D problems'], ['Draw and read a three-figure bearing', 'Resolve a 3-D problem into right-angled triangles'], 'Bearings past-paper questions, 2018 and 2022.', 1], ['Statistics', ['Grouped frequency tables', 'Mean, median, mode'], ['Build a grouped frequency table from raw data', 'Estimate the mean of grouped data'], 'Grouped data worksheet, questions 1–6.', 0], ['Statistics', ['Histograms', 'Cumulative frequency', 'Quartiles'], ['Draw a cumulative frequency curve', 'Read the median and quartiles from the curve'], 'Full statistics question from the 2020 P2.', 0], ['Vectors & Matrices', ['Column vectors', 'Magnitude', 'Position vectors'], ['Add and subtract column vectors', 'Prove three points are collinear using vectors'], 'Vector set A, questions 1–12.', 1], ['Vectors & Matrices', ['Matrix multiplication', 'Determinant & inverse', 'Transformation matrices'], ['Multiply 2×2 matrices reliably', 'Find the inverse of a 2×2 matrix'], 'Matrix set B. Check each inverse by multiplying back.', 1], ['Relations, Functions & Graphs', ['Paper 2 Section I timing', 'Method marks'], ['Complete Section I in 45 minutes', 'Lay out working so method marks are awarded'], 'Finish any unattempted question at home, untimed.', 0], ['Number Theory & Computation', ['Full mock paper', 'Error review'], ['Sit a complete Paper 2 under exam conditions', 'Classify every lost mark as method, accuracy or omission'], 'No new homework — review the marked mock before next term.', 0]];
const RESOURCES = [['Specimen P1 Q1–8 — computation', 'Number worksheet 1A'], ['CSEC 2019 P2 Q1 — hire purchase', 'Interest reference sheet'], ['CSEC 2022 P2 Q1(b) — utility bill', 'PAYE rate card 2027'], ['Specimen P2 Q3 — sets', 'Venn shading poster'], ['CSEC 2021 P2 Q3 — three sets', 'Set word-problem bank'], ['iTutor Generated — indices drill (20)', 'Index law summary'], ['iTutor Generated — factorisation ladder', 'CSEC 2018 P1 Q14–20'], ['Specimen P1 Q9–16 — linear', 'Inequality number-line sheet'], ['CSEC 2020 P2 Q2 — simultaneous', 'Elimination method card'], ['iTutor Generated — quadratics A (15)', 'CSEC 2019 P1 Q22'], ['CSEC 2022 P2 Q2 — quadratic formula', 'Completing-the-square card'], ['Specimen P2 Q5 — functions', 'Mapping diagram sheet'], ['CSEC 2021 P2 Q4 — linear graphs', 'Graph paper pack'], ['CSEC 2021 P2 Q8 — quadratic graph', 'Curve-sketching checklist'], ['iTutor Generated — composite & inverse (12)', 'Function notation card'], ['CSEC 2019 P2 Q4 — compound area', 'Sector formula card'], ['CSEC 2018 P2 Q5 — volume', 'Unit conversion table'], ['Specimen P2 Q7 — circle theorems', 'Circle theorem poster'], ['CSEC 2022 P2 Q6 — transformations', 'Transformation grid pack'], ['iTutor Generated — SOHCAHTOA drill (18)', 'CSEC 2018 P1 Q26'], ['CSEC 2020 P2 Q7 — sine & cosine rules', 'Non-right triangle card'], ['CSEC 2018 P2 Q8 — bearings', 'CSEC 2022 P2 Q8 — 3-D'], ['CSEC 2019 P2 Q9 — grouped data', 'Frequency table template'], ['CSEC 2020 P2 Q10 — cumulative frequency', 'Ogive graph paper'], ['CSEC 2021 P2 Q11 — vectors', 'Column vector sheet'], ['CSEC 2022 P2 Q12 — matrices', 'Inverse matrix card'], ['CSEC 2023 P2 — Section I only', 'Timing sheet'], ['CSEC 2023 P2 — full paper', 'Mark scheme (auto-loaded)']];
const DESCRIPTIONS = ['Diagnostic session. Work through the number and computation basics that Paper 1 assumes, and use the last 15 minutes to find out where the gaps actually are before the plan commits to a route.', 'Hire purchase and interest carry marks in almost every Paper 2. Build the deposit-plus-instalments layout first, then contrast simple and compound interest on the same principal so the difference is visible rather than memorised.', 'Bill reading and payroll. Both are context-heavy and students lose marks on the reading, not the arithmetic, so most of this session is spent on extracting the right figures from a real document.', 'Introduce set notation properly before any Venn diagram is drawn. Every symbol gets stated aloud, then the eight two-set shadings are drawn from memory at the end.', 'Three-set problems with an unknown region. Set up the algebra from the diagram rather than guessing, and check totals against the universal set every time.', 'Indices are the foundation for the whole algebra block and this is a flagged weak area. Slow, drill-heavy session — the four laws, then negative and fractional indices, then a timed set.', 'Factorisation was the largest single gap in the mock. Common factors and grouping first, then difference of two squares, each with an immediate check by expanding back.', 'Linear equations with brackets and fractions, then inequalities and the number line. Emphasis on writing every line of working so method marks survive an arithmetic slip.', 'Simultaneous equations by elimination and substitution. The judgement being taught is which method the given pair actually invites.', 'Factorising quadratics with a leading coefficient of one, and reading roots off factorised form. Pattern recognition drill rather than a derivation.', 'The quadratic formula and completing the square, including the minimum-value question that appears in Paper 2 most years.', 'Function notation, mappings, domain and range. Short session, heavy on reading the notation correctly.', 'Gradient from two points, intercepts, and writing the equation of a line. Plotting is done on real graph paper — the exam gives graph paper, so practice should too.', 'Full quadratic graph question end to end: table of values, accurate curve, then reading the maximum, the roots and the axis of symmetry off the drawing.', 'Composite and inverse functions. Order matters and gets confused, so fg(x) and gf(x) are always computed side by side.', 'Compound plane shapes, then arc length and sector area. Decomposition is the skill; the formulae are on the card.', 'Volume and surface area of prisms and cylinders, plus the unit conversions that cost more marks than the volumes do.', 'Circle theorems with a reason required for every angle. Reasons are marked, so answers without them lose marks even when the number is right.', 'The four transformations, described fully, plus enlargement about a given centre with a negative scale factor.', 'Right-angled trigonometry from the ground up — flagged weak area. Ratio selection is the whole difficulty, so every question starts by labelling the triangle.', 'Sine and cosine rules for non-right triangles, and the ½ab sin C area formula. Choosing between the two rules is drilled explicitly.', 'Bearings in three-figure notation and 3-D problems resolved into right-angled triangles. Diagram first, always, before any calculation.', 'Grouped frequency tables and the estimated mean. Table construction is done by hand before any formula appears.', 'Histograms, cumulative frequency curves and reading quartiles. One full past-paper statistics question completed in the session.', 'Column vectors, magnitude and position vectors, ending on a collinearity proof — flagged weak area.', 'Matrix multiplication, determinant and inverse, then transformation matrices. Every inverse is checked by multiplying back.', 'Timed Section I practice. Forty-five minutes on the clock, then a review of layout and where method marks were left on the table.', 'Full mock paper under exam conditions, then error classification: method, accuracy or omission. This sets the revision priorities for the final weeks.'];
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

/* Generate the session slots the plan sits in. Dates are derived from the slot
   list, so reordering or inserting a row shifts every downstream date for free. */
function buildSlots(startISO, days, count) {
  const out = [];
  const d = new Date(startISO + 'T00:00:00Z');
  let guard = 0;
  while (out.length < count && guard++ < 800) {
    if (days.includes(WEEK_DAYS[d.getUTCDay()])) out.push(isoDate(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
const PLAN_SETUP = {
  subject: 'CSEC Mathematics',
  student: 'Kavita Persad — Form 5',
  examDate: '2027-05-11',
  perWeek: 2,
  minutes: 60,
  days: ['Tue', 'Thu'],
  startDate: '2027-01-05',
  level: 'Standard'
};
const STATUS_SEED = ['completed', 'completed', 'completed', 'completed', 'skipped', 'in_progress'];
function buildPlan() {
  return PLAN_SEED.map((s, i) => ({
    id: 'ps' + (i + 1),
    topicTitle: s[0],
    subTopics: s[1].slice(),
    objectives: s[2].slice(),
    homework: s[3],
    weak: !!s[4],
    minutes: s[0] === 'Number Theory & Computation' && i === PLAN_SEED.length - 1 ? 120 : i === PLAN_SEED.length - 2 ? 90 : 60,
    status: STATUS_SEED[i] || 'planned',
    description: DESCRIPTIONS[i],
    resources: RESOURCES[i].slice(),
    catchUp: false
  }));
}
const STUDENTS = ['Kavita Persad — Form 5', 'Darius Joseph — Form 5', 'Class: CSEC Maths Paper 2 Drills (6)', 'Anaya Baksh — Form 4'];
const WEAK_AREAS = {
  'Kavita Persad — Form 5': ['Algebra', 'Geometry & Trigonometry', 'Vectors & Matrices']
};
Object.assign(window, {
  SYLLABUS,
  PLAN_SETUP,
  buildPlan,
  buildSlots,
  WEEK_DAYS,
  STUDENTS,
  WEAK_AREAS,
  isoDate
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/PlannerData.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/PlannerScreen.jsx
try { (() => {
const {
  Icon
} = window.ITutorDesignSystem_e4581d;

/* ── Exam countdown / orientation strip ───────────────────────────────── */
function PlanStrip({
  setup,
  slots,
  sessions,
  view,
  setView
}) {
  const last = slots[slots.length - 1];
  const toExam = weeksBetween(slots[0], setup.examDate);
  const gap = weeksBetween(last, setup.examDate);
  const done = sessions.filter(s => s.status === 'completed').length;
  const hours = Math.round(sessions.reduce((a, s) => a + s.minutes, 0) / 60);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      padding: '16px 20px',
      marginBottom: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 250
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(25,147,86,0.1)',
      color: 'var(--itutor-green)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "graduation-cap",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--ink)'
    }
  }, toExam, " weeks to exam"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, setup.subject, " \xB7 ", fmtLong(setup.examDate)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-track"
  }, slots.map((iso, i) => /*#__PURE__*/React.createElement("span", {
    key: iso + i,
    "data-status": sessions[i].status,
    title: fmt(iso) + ' · ' + sessions[i].topicTitle
  })), /*#__PURE__*/React.createElement("span", {
    className: "pl-exam",
    title: 'Exam ' + fmtLong(setup.examDate),
    style: {
      marginLeft: Math.min(60, gap * 5)
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag",
    size: 11
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 7,
      display: 'flex',
      gap: 16,
      fontSize: 11,
      color: 'var(--ink-muted)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, sessions.length, " sessions \xB7 ", hours, " hours"), /*#__PURE__*/React.createElement("span", null, done, " completed"), /*#__PURE__*/React.createElement("span", null, fmt(slots[0]), " \u2192 ", fmt(last)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: gap > 3 ? 'oklch(0.58 0.16 40)' : 'var(--ink-muted)'
    }
  }, "Plan ends ", gap, " weeks before the exam"))), /*#__PURE__*/React.createElement("div", {
    className: "pl-seg",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    "data-on": view === 'table' ? '1' : '0',
    onClick: () => setView('table')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "table-2",
    size: 13
  }), useNarrow(1180) ? 'List' : 'Table'), /*#__PURE__*/React.createElement("button", {
    "data-on": view === 'calendar' ? '1' : '0',
    onClick: () => setView('calendar')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 13
  }), "Calendar")));
}

/* ── Commit bar (state D) ─────────────────────────────────────────────── */
function CommitBar({
  sessions,
  committed,
  onCommit,
  onRegenerate,
  onExport,
  dirty
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pl-commit"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      minWidth: 200
    }
  }, committed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(25,147,86,0.12)',
      color: '#0f7a44'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600
    }
  }, sessions.length, " sessions are on your schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "Synced to your calendar. Edits from here update the booked session."))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 15,
    color: "var(--ink-muted)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600
    }
  }, "Draft plan \u2014 not on your schedule yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, dirty ? 'Unsaved edits. ' : '', "Committing creates ", sessions.length, " sessions and notifies the student.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pl-ghost",
    onClick: onRegenerate
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "rotate-ccw",
    size: 13
  }), committed ? 'Start a new plan' : 'Regenerate'), /*#__PURE__*/React.createElement("button", {
    className: "pl-ghost",
    onClick: onExport
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 13
  }), "Export"), committed ? /*#__PURE__*/React.createElement("button", {
    className: "pl-ghost",
    onClick: onExport
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "external-link",
    size: 13
  }), "Open in Sessions") : /*#__PURE__*/React.createElement("button", {
    className: "pl-primary",
    onClick: onCommit
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-plus",
    size: 15
  }), "Commit Plan")));
}

/* ── Screen orchestrator ──────────────────────────────────────────────── */
function PlannerScreen({
  initialPhase = 'setup',
  flash: flashMsg
}) {
  const [phase, setPhase] = React.useState(initialPhase);
  const [setup, setSetup] = React.useState(PLAN_SETUP);
  const [sessions, setSessions] = React.useState(() => buildPlan());
  const [view, setView] = React.useState('table');
  const [open, setOpen] = React.useState(null);
  const [committed, setCommitted] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [flash, setFlash] = React.useState([]);
  const narrow = useNarrow(1180);
  const slots = React.useMemo(() => buildSlots(setup.startDate, setup.days, sessions.length), [setup.startDate, setup.days.join(), sessions.length]);
  const ping = ids => {
    setFlash(ids);
    setTimeout(() => setFlash([]), 900);
  };
  const patch = (id, p) => {
    setDirty(true);
    setSessions(ss => ss.map(s => s.id === id ? {
      ...s,
      ...p
    } : s));
  };
  const move = (from, to) => {
    setDirty(true);
    setSessions(ss => {
      const n = ss.slice();
      const [x] = n.splice(from, 1);
      n.splice(to, 0, x);
      ping(n.slice(Math.min(from, to)).map(s => s.id));
      return n;
    });
  };
  const insertAfter = i => {
    setDirty(true);
    setSessions(ss => {
      const n = ss.slice();
      const prev = ss[i];
      n.splice(i + 1, 0, {
        id: 'cu' + Date.now(),
        topicTitle: prev.topicTitle,
        subTopics: ['Recap', 'Past-paper questions'],
        objectives: ['Close the gaps left from ' + prev.topicTitle],
        homework: 'Redo the questions missed last session.',
        minutes: setup.minutes,
        status: 'planned',
        description: 'Catch-up session. No new material — revisit ' + prev.topicTitle.toLowerCase() + ' and work the questions that were missed.',
        resources: ['Previous session worksheet'],
        weak: false,
        catchUp: true
      });
      ping(n.slice(i + 1).map(s => s.id));
      return n;
    });
  };
  const remove = id => {
    setDirty(true);
    setSessions(ss => {
      const i = ss.findIndex(s => s.id === id);
      const n = ss.filter(s => s.id !== id);
      ping(n.slice(i).map(s => s.id));
      return n;
    });
  };
  if (phase === 'setup') return /*#__PURE__*/React.createElement(Page, {
    title: "Lesson Planner",
    sub: "Generate a term of sessions from a subject and an exam date."
  }, /*#__PURE__*/React.createElement(PlannerSetup, {
    onGenerate: f => {
      setSetup(f);
      setSessions(buildPlan());
      setPhase('building');
      setTimeout(() => setPhase('plan'), 1500);
    }
  }));
  if (phase === 'building') return /*#__PURE__*/React.createElement(Page, {
    title: "Lesson Planner",
    sub: setup.subject + ' · ' + setup.student
  }, /*#__PURE__*/React.createElement(PlannerBuilding, {
    setup: setup
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 84
    }
  }, /*#__PURE__*/React.createElement(Page, {
    title: "Lesson Planner",
    sub: setup.subject + ' · ' + setup.student + ' · ' + setup.level,
    right: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, committed && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(25,147,86,0.1)',
        color: '#0f7a44',
        fontSize: 'var(--text-xs)',
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-check",
      size: 13
    }), "Committed"), /*#__PURE__*/React.createElement("button", {
      className: "pl-ghost",
      onClick: () => setPhase('setup')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sliders-horizontal",
      size: 13
    }), "Setup"))
  }, /*#__PURE__*/React.createElement(PlanStrip, {
    setup: setup,
    slots: slots,
    sessions: sessions,
    view: view,
    setView: setView
  }), view === 'table' ? narrow ? /*#__PURE__*/React.createElement(PlanList, {
    sessions: sessions,
    slots: slots,
    setup: setup,
    committed: committed,
    flash: flash,
    open: open,
    setOpen: setOpen,
    patch: patch,
    move: move,
    insertAfter: insertAfter,
    remove: remove
  }) : /*#__PURE__*/React.createElement(PlanTable, {
    sessions: sessions,
    slots: slots,
    setup: setup,
    committed: committed,
    flash: flash,
    open: open,
    setOpen: setOpen,
    patch: patch,
    move: move,
    insertAfter: insertAfter,
    remove: remove
  }) : /*#__PURE__*/React.createElement(PlanCalendar, {
    sessions: sessions,
    slots: slots,
    setOpen: id => {
      setOpen(id);
      setView('table');
    }
  })), /*#__PURE__*/React.createElement(CommitBar, {
    sessions: sessions,
    committed: committed,
    dirty: dirty,
    onCommit: () => {
      setCommitted(true);
      setDirty(false);
      flashMsg && flashMsg(sessions.length + ' sessions added to your schedule. ' + setup.student.split(' —')[0] + ' has been notified.');
    },
    onRegenerate: () => {
      setCommitted(false);
      setDirty(false);
      setPhase('setup');
    },
    onExport: () => flashMsg && flashMsg('Export ready — CSV and PDF. (Not wired in this prototype.)')
  }));
}
function Page({
  title,
  sub,
  right,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--ink)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, sub)), right), children);
}
Object.assign(window, {
  PlannerScreen,
  PlanStrip,
  CommitBar,
  Page
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/PlannerScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/PlannerView.jsx
try { (() => {
const {
  Icon,
  Avatar
} = window.ITutorDesignSystem_e4581d;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = iso => {
  const d = new Date(iso + 'T00:00:00Z');
  return WEEK_DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()];
};
const fmtLong = iso => {
  const d = new Date(iso + 'T00:00:00Z');
  return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
};
const weeksBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 6048e5);
const card = {
  background: '#fff',
  border: '1px solid var(--surface-border)',
  borderRadius: 'var(--radius-xl)'
};
const h2 = {
  margin: 0,
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: 'var(--ink)'
};
const lbl = {
  display: 'block',
  marginBottom: 6,
  fontSize: 'var(--text-xs)',
  fontWeight: 600,
  color: 'var(--ink)'
};
const help = {
  marginTop: 6,
  fontSize: 11,
  color: 'var(--ink-muted)'
};

/* ── Setup (state A, and the empty state) ─────────────────────────────── */
function PlannerSetup({
  onGenerate
}) {
  const [f, setF] = React.useState(PLAN_SETUP);
  const set = (k, v) => setF(p => ({
    ...p,
    [k]: v
  }));
  const toggleDay = d => set('days', f.days.includes(d) ? f.days.filter(x => x !== d) : WEEK_DAYS.filter(x => f.days.includes(x) || x === d));
  const weak = WEAK_AREAS[f.student];
  const ready = f.days.length > 0 && f.subject && f.examDate;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      display: 'inline-grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(25,147,86,0.1)',
      color: 'var(--itutor-green)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-range",
    size: 24
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...h2,
      fontSize: 28,
      marginTop: 14
    }
  }, "No plan yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px auto 0',
      maxWidth: 460,
      fontSize: 'var(--text-sm)',
      lineHeight: 1.6,
      color: 'var(--ink-muted)',
      textWrap: 'pretty'
    }
  }, "Tell us the subject, the exam date and when you teach. You get back an ordered set of sessions you can edit row by row before anything reaches your schedule.")), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      padding: 24,
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-setup-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Subject"), /*#__PURE__*/React.createElement("select", {
    className: "pl-in",
    value: f.subject,
    onChange: e => set('subject', e.target.value)
  }, Object.keys(SYLLABUS).map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Student or class"), /*#__PURE__*/React.createElement("select", {
    className: "pl-in",
    value: f.student,
    onChange: e => set('student', e.target.value)
  }, STUDENTS.map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))), weak ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...help,
      color: 'oklch(0.58 0.16 40)',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 11
  }), "Weak areas on file: ", weak.join(', ')) : /*#__PURE__*/React.createElement("div", {
    style: help
  }, "No weak areas on file yet.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Start date"), /*#__PURE__*/React.createElement("input", {
    className: "pl-in",
    type: "date",
    value: f.startDate,
    onChange: e => set('startDate', e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Exam date"), /*#__PURE__*/React.createElement("input", {
    className: "pl-in",
    type: "date",
    value: f.examDate,
    onChange: e => set('examDate', e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: help
  }, weeksBetween(f.startDate, f.examDate), " weeks of teaching time.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Sessions per week"), /*#__PURE__*/React.createElement(Stepper, {
    value: f.perWeek,
    min: 1,
    max: 5,
    onChange: v => set('perWeek', v),
    suffix: f.perWeek === 1 ? 'session' : 'sessions'
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Session length"), /*#__PURE__*/React.createElement(Stepper, {
    value: f.minutes,
    min: 30,
    max: 180,
    step: 15,
    onChange: v => set('minutes', v),
    suffix: "min"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Preferred days"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, WEEK_DAYS.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    className: "pl-day",
    "data-on": f.days.includes(d) ? '1' : '0',
    onClick: () => toggleDay(d)
  }, d))), f.days.length !== f.perWeek && /*#__PURE__*/React.createElement("div", {
    style: {
      ...help,
      color: f.days.length < f.perWeek ? 'var(--warning-fg)' : 'var(--ink-muted)'
    }
  }, f.days.length < f.perWeek ? 'Pick at least ' + f.perWeek + ' days to fit ' + f.perWeek + ' sessions a week.' : 'More days selected than sessions per week — the plan will use the earliest available.')), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Current level"), /*#__PURE__*/React.createElement("div", {
    className: "pl-seg"
  }, ['Foundation', 'Standard', 'Extension'].map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    "data-on": f.level === l ? '1' : '0',
    onClick: () => set('level', l)
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pl-primary",
    disabled: !ready,
    onClick: () => onGenerate(f)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  }), "Generate Plan"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "Nothing is added to your schedule until you commit."))));
}
function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pl-step"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(Math.max(min, value - step)),
    disabled: value <= min
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 14
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, value), " ", suffix), /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(Math.min(max, value + step)),
    disabled: value >= max
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  })));
}

/* ── Generating (short, not a chat) ───────────────────────────────────── */
function PlannerBuilding({
  setup
}) {
  const steps = ['Reading the ' + setup.subject + ' syllabus', 'Weighting flagged weak areas', 'Fitting ' + setup.perWeek + ' sessions a week to ' + setup.days.join(' / '), 'Writing objectives and homework'];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI(v => Math.min(steps.length - 1, v + 1)), 340);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '48px auto',
      ...card,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pl-spin"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "loader",
    size: 16
  })), /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Building the plan")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'grid',
      gap: 10
    }
  }, steps.map((s, n) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontSize: 'var(--text-sm)',
      color: n <= i ? 'var(--ink)' : '#c3c8cd'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n < i ? 'check-circle-2' : 'circle',
    size: 15,
    color: n < i ? 'var(--itutor-green)' : 'currentColor'
  }), s))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'grid',
      gap: 8
    }
  }, [0, 1, 2, 3, 4].map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: "pl-shim",
    style: {
      height: 34,
      animationDelay: n * 0.09 + 's'
    }
  }))));
}

/* ── Inline editable cell ─────────────────────────────────────────────── */
function EditText({
  value,
  onChange,
  style,
  multiline,
  placeholder
}) {
  const [edit, setEdit] = React.useState(false);
  const [v, setV] = React.useState(value);
  React.useEffect(() => setV(value), [value]);
  const commit = () => {
    setEdit(false);
    if (v !== value) onChange(v);
  };
  if (!edit) return /*#__PURE__*/React.createElement("span", {
    className: "pl-edit",
    style: style,
    onClick: e => {
      e.stopPropagation();
      setEdit(true);
    }
  }, value || /*#__PURE__*/React.createElement("i", {
    style: {
      color: '#9ca3af'
    }
  }, placeholder));
  const P = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement(P, {
    className: "pl-in",
    autoFocus: true,
    rows: multiline ? 3 : undefined,
    value: v,
    onClick: e => e.stopPropagation(),
    onChange: e => setV(e.target.value),
    onBlur: commit,
    onKeyDown: e => {
      if (e.key === 'Enter' && !multiline) commit();
      if (e.key === 'Escape') {
        setV(value);
        setEdit(false);
      }
    },
    style: {
      fontSize: 'var(--text-sm)'
    }
  });
}
function ChipEditor({
  items,
  onChange,
  tone
}) {
  const [adding, setAdding] = React.useState(false);
  const [v, setV] = React.useState('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5,
      alignItems: 'center'
    },
    onClick: e => e.stopPropagation()
  }, items.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: s + i,
    className: "pl-chip",
    "data-tone": tone || 'n'
  }, s, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(items.filter((_, n) => n !== i)),
    "aria-label": 'Remove ' + s
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 9
  })))), adding ? /*#__PURE__*/React.createElement("input", {
    className: "pl-in",
    autoFocus: true,
    value: v,
    placeholder: "Add sub-topic",
    style: {
      width: 150,
      fontSize: 'var(--text-xs)',
      padding: '3px 8px'
    },
    onChange: e => setV(e.target.value),
    onBlur: () => {
      if (v.trim()) onChange(items.concat(v.trim()));
      setV('');
      setAdding(false);
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        if (v.trim()) onChange(items.concat(v.trim()));
        setV('');
        setAdding(false);
      }
    }
  }) : /*#__PURE__*/React.createElement("button", {
    className: "pl-chip-add",
    onClick: () => setAdding(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 10
  }), "Add"));
}
const STATUSES = ['planned', 'in_progress', 'completed', 'skipped'];
function StatusCell({
  value,
  onChange,
  locked
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "pl-statusbtn",
    onClick: () => setOpen(!open)
  }, /*#__PURE__*/React.createElement(AIBadge, {
    kind: value
  }), !locked && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 12,
    color: "#9ca3af"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "pl-menu"
  }, STATUSES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => {
      onChange(s);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement(AIBadge, {
    kind: s,
    size: "sm"
  }), s === value && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    color: "var(--itutor-green)"
  })))));
}

/* ── Session detail (state C) ─────────────────────────────────────────── */
function SessionDetail({
  s,
  date,
  onPatch,
  showSubs,
  stack
}) {
  const [checked, setChecked] = React.useState([]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: stack ? '16px 16px 18px' : '18px 20px 22px 56px',
      background: 'var(--surface-inset)',
      borderTop: '1px solid var(--surface-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: stack ? '1fr' : '1.35fr 1fr',
      gap: stack ? 20 : 28
    }
  }, /*#__PURE__*/React.createElement("div", null, showSubs && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "tags"
  }, "Sub-topics"), /*#__PURE__*/React.createElement(ChipEditor, {
    items: s.subTopics,
    onChange: v => onPatch({
      subTopics: v
    })
  })), /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "align-left"
  }, "What will be taught \u2014 ", fmt(date)), /*#__PURE__*/React.createElement(EditText, {
    multiline: true,
    value: s.description,
    onChange: v => onPatch({
      description: v
    }),
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.65,
      color: 'var(--ink)',
      textWrap: 'pretty'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "check-square"
  }, "Objectives")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 7
    }
  }, s.objectives.map((o, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    style: {
      display: 'flex',
      gap: 9,
      alignItems: 'flex-start',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.5,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked.includes(i),
    onChange: () => setChecked(c => c.includes(i) ? c.filter(x => x !== i) : c.concat(i)),
    style: {
      marginTop: 3,
      accentColor: 'var(--itutor-green)',
      width: 15,
      height: 15
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: checked.includes(i) ? 'var(--ink-muted)' : 'var(--ink)',
      textDecoration: checked.includes(i) ? 'line-through' : 'none'
    }
  }, o))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "library"
  }, "Suggested resources"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 7
    }
  }, s.resources.map(r => /*#__PURE__*/React.createElement("a", {
    key: r,
    href: "#",
    className: "pl-res",
    onClick: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: r.startsWith('iTutor Generated') ? 'sparkles' : 'file-text',
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, r), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 12
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "home"
  }, "Homework")), /*#__PURE__*/React.createElement(EditText, {
    multiline: true,
    value: s.homework,
    onChange: v => onPatch({
      homework: v
    }),
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.6,
      color: 'var(--ink)'
    }
  }))));
}
function SectionLabel({
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 9,
      fontSize: 'var(--text-2xs)',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 12
  }), children);
}

/* ── Table (state B — the main screen) ────────────────────────────────── */
function PlanTable({
  sessions,
  slots,
  setup,
  committed,
  flash,
  open,
  setOpen,
  patch,
  move,
  insertAfter,
  remove
}) {
  const [drag, setDrag] = React.useState(null);
  const weakOn = WEAK_AREAS[setup.student] || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "pl-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 34
    }
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40
    }
  }, "#"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 120
    }
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 210
    }
  }, "Topic"), /*#__PURE__*/React.createElement("th", null, "Sub-topics"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 86
    }
  }, "Length"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 150
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 70
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, sessions.map((s, i) => {
    const isOpen = open === s.id;
    const isWeak = s.weak || weakOn.includes(s.topicTitle);
    return [/*#__PURE__*/React.createElement("tr", {
      key: s.id,
      className: "pl-row",
      "data-open": isOpen ? '1' : '0',
      "data-drag": drag === i ? '1' : '0',
      "data-skip": s.status === 'skipped' ? '1' : '0',
      draggable: !committed,
      onDragStart: () => setDrag(i),
      onDragEnd: () => setDrag(null),
      onDragOver: e => {
        e.preventDefault();
        if (drag !== null && drag !== i) {
          move(drag, i);
          setDrag(i);
        }
      },
      onClick: () => setOpen(isOpen ? null : s.id)
    }, /*#__PURE__*/React.createElement("td", {
      className: "pl-handle"
    }, committed ? /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 13,
      color: "#9ca3af"
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: "grip-vertical",
      size: 14,
      color: "#c3c8cd"
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--ink-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, i + 1), /*#__PURE__*/React.createElement("td", {
      className: flash.includes(s.id) ? 'pl-flash' : '',
      style: {
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap'
      }
    }, fmt(slots[i]), committed && /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-check",
      size: 12,
      color: "var(--itutor-green)",
      style: {
        marginLeft: 6,
        verticalAlign: '-1px'
      }
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(TopicPicker, {
      value: s.topicTitle,
      subject: setup.subject,
      onChange: v => patch(s.id, {
        topicTitle: v
      })
    }), isWeak && /*#__PURE__*/React.createElement(AIBadge, {
      kind: "weak",
      size: "sm",
      label: "Weak"
    }), s.catchUp && /*#__PURE__*/React.createElement(AIBadge, {
      kind: "planned",
      size: "sm",
      label: "Catch-up",
      icon: "rotate-ccw"
    }))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ChipEditor, {
      items: s.subTopics,
      onChange: v => patch(s.id, {
        subTopics: v
      })
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(EditText, {
      value: String(s.minutes),
      onChange: v => patch(s.id, {
        minutes: parseInt(v, 10) || 60
      }),
      style: {
        fontVariantNumeric: 'tabular-nums'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-muted)'
      }
    }, " min")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusCell, {
      value: s.status,
      onChange: v => patch(s.id, {
        status: v
      }),
      locked: committed
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2
      }
    }, !committed && /*#__PURE__*/React.createElement("button", {
      className: "pl-ico",
      title: "Remove session",
      onClick: e => {
        e.stopPropagation();
        remove(s.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 13
    })), /*#__PURE__*/React.createElement("button", {
      className: "pl-ico",
      title: "Session detail"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: isOpen ? 'chevron-up' : 'chevron-down',
      size: 14
    }))))), isOpen && /*#__PURE__*/React.createElement("tr", {
      key: s.id + '-d',
      className: "pl-detail"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 8,
      style: {
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(SessionDetail, {
      s: s,
      date: slots[i],
      onPatch: p => patch(s.id, p)
    }))), !committed && /*#__PURE__*/React.createElement("tr", {
      key: s.id + '-i',
      className: "pl-ins"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 8
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => insertAfter(i)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 11
    }), "Add catch-up session")))];
  }))));
}
function TopicPicker({
  value,
  subject,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const list = SYLLABUS[subject] || [];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "pl-topic",
    onClick: () => setOpen(!open)
  }, value, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 11,
    color: "#9ca3af"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "pl-menu",
    style: {
      width: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 10px 8px',
      fontSize: 11,
      color: 'var(--ink-muted)',
      borderBottom: '1px solid var(--surface-border)'
    }
  }, subject, " syllabus sections"), list.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => {
      onChange(t);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, t), t === value && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    color: "var(--itutor-green)"
  })))));
}

/* ── Calendar view (secondary toggle, same data) ──────────────────────── */
function PlanCalendar({
  sessions,
  slots,
  setOpen
}) {
  const months = [];
  slots.forEach((iso, i) => {
    const d = new Date(iso + 'T00:00:00Z');
    const key = d.getUTCFullYear() + '-' + d.getUTCMonth();
    let m = months.find(x => x.key === key);
    if (!m) {
      m = {
        key,
        y: d.getUTCFullYear(),
        m: d.getUTCMonth(),
        items: []
      };
      months.push(m);
    }
    m.items.push({
      day: d.getUTCDate(),
      i
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))',
      gap: 18
    }
  }, months.map(mo => {
    const first = new Date(Date.UTC(mo.y, mo.m, 1)).getUTCDay();
    const len = new Date(Date.UTC(mo.y, mo.m + 1, 0)).getUTCDate();
    return /*#__PURE__*/React.createElement("div", {
      key: mo.key,
      style: {
        ...card,
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        marginBottom: 12
      }
    }, MONTHS[mo.m], " ", mo.y), /*#__PURE__*/React.createElement("div", {
      className: "pl-cal"
    }, WEEK_DAYS.map(d => /*#__PURE__*/React.createElement("div", {
      key: d,
      className: "pl-cal-h"
    }, d[0])), Array.from({
      length: first
    }).map((_, n) => /*#__PURE__*/React.createElement("div", {
      key: 'e' + n
    })), Array.from({
      length: len
    }).map((_, n) => {
      const hit = mo.items.find(x => x.day === n + 1);
      const s = hit && sessions[hit.i];
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        className: "pl-cal-d",
        "data-on": hit ? '1' : '0',
        "data-status": s ? s.status : '',
        onClick: () => hit && setOpen(s.id)
      }, /*#__PURE__*/React.createElement("span", null, n + 1), s && /*#__PURE__*/React.createElement("em", null, s.topicTitle.split(' ')[0], /*#__PURE__*/React.createElement("br", null), s.minutes, "m"));
    })));
  }));
}

/* ── Narrow viewport: the same plan as a stacked session list ─────────── */
function useNarrow(px = 1180) {
  const q = '(max-width:' + px + 'px)';
  const [n, setN] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => {
    const m = window.matchMedia(q);
    const h = () => setN(m.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, [q]);
  return n;
}
function PlanList({
  sessions,
  slots,
  setup,
  committed,
  flash,
  open,
  setOpen,
  patch,
  move,
  insertAfter,
  remove
}) {
  const weakOn = WEAK_AREAS[setup.student] || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, sessions.map((s, i) => {
    const isOpen = open === s.id;
    const isWeak = s.weak || weakOn.includes(s.topicTitle);
    return /*#__PURE__*/React.createElement("div", {
      key: s.id
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...card,
        overflow: 'visible',
        boxShadow: isOpen ? 'var(--shadow-card)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "pl-scard",
      "data-skip": s.status === 'skipped' ? '1' : '0',
      onClick: () => setOpen(isOpen ? null : s.id)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: '#9ca3af',
        fontVariantNumeric: 'tabular-nums',
        minWidth: 18
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      className: flash.includes(s.id) ? 'pl-flash' : '',
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        borderRadius: 5,
        padding: '1px 4px'
      }
    }, fmt(slots[i])), committed && /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 12,
      color: "#9ca3af"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(EditText, {
      value: String(s.minutes),
      onChange: v => patch(s.id, {
        minutes: parseInt(v, 10) || 60
      }),
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--ink-muted)'
      }
    }, "min"), /*#__PURE__*/React.createElement(Icon, {
      name: isOpen ? 'chevron-up' : 'chevron-down',
      size: 16,
      color: "#9ca3af"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(TopicPicker, {
      value: s.topicTitle,
      subject: setup.subject,
      onChange: v => patch(s.id, {
        topicTitle: v
      })
    }), isWeak && /*#__PURE__*/React.createElement(AIBadge, {
      kind: "weak",
      size: "sm",
      label: "Weak"
    }), s.catchUp && /*#__PURE__*/React.createElement(AIBadge, {
      kind: "planned",
      size: "sm",
      label: "Catch-up",
      icon: "rotate-ccw"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(StatusCell, {
      value: s.status,
      onChange: v => patch(s.id, {
        status: v
      }),
      locked: committed
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#9ca3af'
      }
    }, s.subTopics.length, " sub-topics"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), !committed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "pl-ico",
      title: "Move earlier",
      disabled: i === 0,
      onClick: e => {
        e.stopPropagation();
        move(i, i - 1);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "pl-ico",
      title: "Move later",
      disabled: i === sessions.length - 1,
      onClick: e => {
        e.stopPropagation();
        move(i, i + 1);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-down",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "pl-ico",
      title: "Remove session",
      onClick: e => {
        e.stopPropagation();
        remove(s.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 14
    }))))), isOpen && /*#__PURE__*/React.createElement(SessionDetail, {
      s: s,
      date: slots[i],
      showSubs: true,
      stack: true,
      onPatch: p => patch(s.id, p)
    })), !committed && /*#__PURE__*/React.createElement("div", {
      className: "pl-ins-s"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => insertAfter(i)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 11
    }), "Add catch-up session")));
  }));
}
Object.assign(window, {
  PlannerSetup,
  PlannerBuilding,
  PlanTable,
  PlanList,
  useNarrow,
  PlanCalendar,
  SessionDetail,
  AIBadgeRefFmt: fmt,
  fmt,
  fmtLong,
  weeksBetween,
  card,
  h2,
  EditText,
  ChipEditor,
  Stepper,
  SectionLabel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/PlannerView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/TutorScreens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Card,
  StatCard,
  Badge,
  Button,
  Icon,
  GroupCard,
  Avatar,
  StarRating,
  SubjectPill
} = window.ITutorDesignSystem_e4581d;
const SESSIONS = [{
  student: 'Maya Persad',
  subject: 'Physics',
  when: 'Tue, Sep 2 · 4:00 PM',
  minutes: 60,
  status: 'Upcoming',
  tone: 'success'
}, {
  student: 'Jaden Baptiste',
  subject: 'CSEC Mathematics',
  when: 'Tue, Sep 2 · 6:00 PM',
  minutes: 90,
  status: 'Upcoming',
  tone: 'success'
}, {
  student: 'Sarah Khan',
  subject: 'Add Maths',
  when: 'Mon, Sep 1 · 5:00 PM',
  minutes: 60,
  status: 'In Progress',
  tone: 'progress'
}, {
  student: 'Terrence Lee',
  subject: 'Physics',
  when: 'Sun, Aug 31 · 3:00 PM',
  minutes: 60,
  status: 'Completed',
  tone: 'success'
}, {
  student: 'Amara Joseph',
  subject: 'CAPE Pure Maths',
  when: 'Sat, Aug 30 · 11:00 AM',
  minutes: 90,
  status: 'No Show',
  tone: 'warning'
}];
function TutorDashboard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 24,
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#111827'
    }
  }, "Dashboard"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: '#6b7280'
    }
  }, "Two sessions today. Your next one starts in 3 hours.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Sessions This Week",
    value: 9,
    icon: "calendar-days"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Active Students",
    value: 14,
    icon: "users",
    tone: "neutral"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Hours Taught",
    value: 112,
    icon: "clock",
    tone: "neutral"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Wallet Balance",
    value: "$4,320",
    icon: "wallet",
    tone: "neutral"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0
    }
  }, "Sessions"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--itutor-green)'
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid'
    }
  }, SESSIONS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.student,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderTop: i ? '1px solid #f3f4f6' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: s.student,
    size: 36,
    hue: 40 + i * 60
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#111827'
    }
  }, s.student), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#6b7280'
    }
  }, s.subject, " \xB7 ", s.minutes, " min")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, s.when), /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone
  }, s.status))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0,
      marginBottom: 12
    }
  }, "My Rating"), /*#__PURE__*/React.createElement(StarRating, {
    value: 4.9,
    count: 42,
    size: 20
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: '#6b7280'
    }
  }, "\u201CExplains every step until it makes sense. My son went from a 4 to a Grade I.\u201D")), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: '#111827',
      letterSpacing: 0,
      marginBottom: 12
    }
  }, "Verified Subjects"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, ['CSEC Mathematics', 'Add Maths', 'Physics', 'CAPE Pure Maths'].map(s => /*#__PURE__*/React.createElement(SubjectPill, {
    key: s
  }, s))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      marginTop: 16
    },
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    })
  }, "Add a subject")))));
}
const MY_GROUPS = [{
  name: 'CSEC Maths Intensive — Paper 2 Drills',
  subjects: ['Mathematics'],
  tutorName: 'Arjun Rambally',
  rating: 4.9,
  reviewCount: 42,
  members: 13,
  nextSession: 'Sep 4',
  length: '1.5 hrs',
  price: 250,
  spotsLeft: 2
}, {
  name: 'Add Maths Bootcamp',
  subjects: ['Add Maths'],
  tutorName: 'Arjun Rambally',
  rating: 4.9,
  reviewCount: 42,
  members: 6,
  nextSession: 'Sep 5',
  length: '1 hr',
  price: 200,
  coverGradient: 'linear-gradient(135deg,#38bdf8,#0ea5e9)'
}, {
  name: 'Physics Past-Paper Clinic',
  subjects: ['Physics'],
  tutorName: 'Arjun Rambally',
  rating: 4.9,
  reviewCount: 42,
  members: 19,
  nextSession: null,
  length: '2 hrs',
  price: null,
  coverGradient: 'linear-gradient(135deg,#c084fc,#7c3aed)'
}];
function TutorClasses() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: '#111827'
    }
  }, "My Classes"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: '#6b7280'
    }
  }, "Group classes you run, and what they earn.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16,
      color: "#fff"
    })
  }, "Create a class")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, MY_GROUPS.map(g => /*#__PURE__*/React.createElement(GroupCard, _extends({
    key: g.name
  }, g)))));
}
Object.assign(window, {
  TutorDashboard,
  TutorClasses
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/TutorScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/TutorShellView.jsx
try { (() => {
const {
  SidebarNavItem,
  SearchField,
  Icon,
  Avatar,
  Button,
  ProgressBar
} = window.ITutorDesignSystem_e4581d;
const NAV = [{
  label: 'Dashboard',
  icon: 'layout-dashboard'
}, {
  label: 'My Classes',
  icon: 'book-open'
}, {
  label: 'Sessions',
  icon: 'calendar-days'
}, {
  label: 'My Students',
  icon: 'users'
}, {
  label: 'Clients',
  icon: 'contact',
  badgeKey: 'clients'
}, {
  label: 'My Wallet',
  icon: 'wallet'
}, {
  label: 'Reviews',
  icon: 'star'
}, {
  label: 'My Business',
  icon: 'rocket',
  gated: true
}, {
  label: 'iTutor AI',
  icon: 'sparkles'
}];
function TutorShell({
  active,
  onNavigate,
  children,
  listed = false,
  completed = 3,
  total = 5,
  tutorName = 'Arjun Rambally',
  tutorAvatar = '../../assets/team/arjun-rambally.jpg'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      overflow: 'hidden',
      background: 'var(--background)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-w)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      background: 'var(--ink)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '16px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/itutor-logo-dark.png",
    alt: "iTutor",
    style: {
      height: 28,
      flex: 1,
      objectFit: 'contain',
      objectPosition: 'left'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      color: 'rgba(255,255,255,0.6)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "panel-left-close",
    size: 16
  }))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: '12px',
      display: 'grid',
      gap: 2,
      alignContent: 'start'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement(SidebarNavItem, {
    key: n.label,
    label: n.label,
    icon: n.icon,
    active: active === n.label,
    locked: n.gated && !listed,
    onClick: () => onNavigate(n.label)
  })), !listed && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 0 0',
      padding: 12,
      borderRadius: 'var(--radius-xl)',
      background: 'color-mix(in oklab, var(--brand) 15%, transparent)',
      border: '1px solid color-mix(in oklab, var(--brand) 30%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: '#fff'
    }
  }, "Get listed"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 1.4,
      color: 'rgba(255,255,255,0.7)'
    }
  }, "Finish ", total - completed, " more steps to start teaching."), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      marginTop: 8,
      display: 'block',
      textAlign: 'center',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      padding: '6px 8px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--brand)',
      color: '#fff'
    }
  }, "Continue"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: tutorAvatar,
    name: tutorName,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: '#fff'
    }
  }, tutorName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Tutor")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-up",
    size: 16,
    color: "rgba(255,255,255,0.6)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--topbar-h)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 448
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    shape: "rect",
    placeholder: "Search students, lessons, sessions\u2026"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: '9999px',
      background: 'var(--brand)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 'var(--weight-bold)',
      display: 'grid',
      placeItems: 'center'
    }
  }, "3")), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 16
  }))), !listed && /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(90deg,oklch(0.97 0.05 150),oklch(0.96 0.04 165))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--brand)',
      color: '#fff',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "Complete your profile to get listed and start teaching."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: completed / total * 100,
    label: completed + ' of ' + total + ' steps complete'
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "ink"
  }, "Complete profile")))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: 32
    }
  }, children)));
}
Object.assign(window, {
  TutorShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/TutorShellView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tutor-app/TutorSpec.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  StarRating,
  Input,
  VerifiedBadge
} = window.ITutorDesignSystem_e4581d;

/* Tutor surface, §5. Anisa Mohammed's roster. Two rules shape everything here:
   attendance is automatic and uneditable, and feedback is optional and pull-based
   — so no marking controls exist, and open requests are the only thing that
   should draw the eye in a roster row. */

const ATT = {
  attended: {
    label: 'Attended',
    icon: 'check',
    bg: 'rgba(25,147,86,0.1)',
    fg: 'var(--itutor-green)'
  },
  late: {
    label: 'Late',
    icon: 'clock',
    bg: '#fffbeb',
    fg: '#b45309'
  },
  absent: {
    label: 'Absent',
    icon: 'x',
    bg: '#fef2f2',
    fg: '#dc2626'
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'ban',
    bg: 'var(--neutral-bg)',
    fg: '#6b7280'
  }
};
const PARTICIPATION = ['Yes', 'Occasionally', 'Not often', 'I can\u2019t recall the student ever participating'];

/* history is oldest-first across the six sessions of THIS class that the grid shows.
   platformHistory is the student's whole record — the figure quoted in a roster row
   and in feedback, and the same record the parent and student kits tally. */
const ROSTER = [{
  id: 'st1',
  name: 'Aaliyah Ramkissoon',
  form: 'Form 5',
  parent: 'Priya Ramkissoon',
  via: 'CSEC Mathematics — Paper 2 Drills',
  platformHistory: ['attended', 'absent', 'attended', 'cancelled', 'attended', 'attended', 'late', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended'],
  history: ['attended', 'attended', 'cancelled', 'late', 'attended', 'attended'],
  request: {
    on: '4 Sep',
    by: 'parent'
  }
}, {
  id: 'st2',
  name: 'Josiah Ramkissoon',
  form: 'Form 3',
  parent: 'Priya Ramkissoon',
  via: 'CSEC Mathematics — Paper 2 Drills',
  platformHistory: ['attended', 'absent', 'attended', 'late', 'attended', 'attended', 'absent', 'attended', 'late', 'attended', 'attended'],
  history: ['attended', 'absent', 'attended', 'late', 'attended', 'absent'],
  request: null
}, {
  id: 'st3',
  name: 'Deneisha Baptiste',
  form: 'Form 5',
  parent: null,
  via: 'CSEC Mathematics — Paper 2 Drills',
  platformHistory: ['attended', 'attended', 'cancelled', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended'],
  history: ['attended', 'attended', 'cancelled', 'attended', 'attended', 'attended'],
  request: {
    on: '2 Sep',
    by: 'student'
  }
}, {
  id: 'st4',
  name: 'Kwesi Charles',
  form: 'Form 4',
  parent: null,
  via: 'CSEC Mathematics — Paper 2 Drills',
  platformHistory: ['absent', 'attended', 'cancelled', 'attended', 'absent', 'attended', 'attended', 'absent', 'attended', 'attended'],
  history: ['absent', 'attended', 'cancelled', 'attended', 'absent', 'attended'],
  request: null
}];
const ONE_TO_ONES = [{
  id: 'st5',
  name: 'Rianna Persaud',
  form: 'Form 6',
  parent: 'Vishal Persaud',
  via: 'CAPE Pure Maths 1:1',
  platformHistory: ['attended', 'attended', 'attended', 'late', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended'],
  history: ['attended', 'attended', 'attended', 'late', 'attended', 'attended'],
  request: null
}, {
  id: 'st6',
  name: 'Micah Joseph',
  form: 'Form 5',
  parent: null,
  via: 'Add Maths 1:1',
  platformHistory: ['attended', 'absent', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended'],
  history: ['attended', 'absent', 'attended', 'attended', 'attended', 'attended'],
  request: {
    on: '5 Sep',
    by: 'student'
  }
}];
const SESSIONS = ['12 Aug', '16 Aug', '19 Aug', '23 Aug', '26 Aug', '30 Aug'];
const rateOf = h => {
  const counted = h.filter(s => s !== 'cancelled').length;
  const up = h.filter(s => s === 'attended' || s === 'late').length;
  return {
    rate: counted ? Math.round(up / counted * 100) : 0,
    counted
  };
};
function Title({
  children,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, children), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, sub)), right);
}

/* ── 5.1 / 5.4 roster row ────────────────────────────────────────────── */
/* The parent block appears only when linked, carries a name and nothing else —
   no email, no phone, no profile link. Message targets whoever will receive it
   and the button says so. */
function StudentRow({
  s,
  showVia,
  onFeedback,
  onMessage
}) {
  const {
    rate,
    counted
  } = rateOf(s.platformHistory);
  const recipient = s.parent || s.name.split(' ')[0];
  return /*#__PURE__*/React.createElement(Card, {
    padding: "18px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: s.name,
    size: 44,
    rounded: "2xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: '#9ca3af'
    }
  }, s.form)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 'var(--text-xs)',
      color: '#4b5563'
    }
  }, "Attendance ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, rate, "% of ", counted, " sessions")), s.parent && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 'var(--text-xs)',
      color: '#6b7280'
    }
  }, "Parent: ", s.parent), showVia && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 11,
      color: '#9ca3af'
    }
  }, s.via), s.request && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      padding: '5px 10px',
      borderRadius: 9999,
      background: 'rgba(147,51,234,0.1)',
      border: '1px solid rgba(147,51,234,0.3)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 9999,
      background: '#7c3aed'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-bold)',
      color: '#6b21a8'
    }
  }, "Feedback requested ", s.request.on), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#7c3aed'
    }
  }, "by ", s.request.by === 'parent' ? 'parent' : 'student'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: s.request ? 'primary' : 'secondary',
    size: "sm",
    onClick: () => onFeedback(s)
  }, "Send feedback"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => onMessage(s)
  }, s.parent ? 'Message parent' : 'Message ' + recipient))));
}
function Roster({
  students,
  title,
  sub,
  showVia,
  onFeedback,
  onMessage
}) {
  const [filter, setFilter] = React.useState('All');
  const shown = (filter === 'Requests open' ? students.filter(s => s.request) : students).slice().sort((a, b) => (b.request ? 1 : 0) - (a.request ? 1 : 0));
  const open = students.filter(s => s.request).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(Title, {
    sub: sub,
    right: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, ['All', 'Requests open'].map(f => /*#__PURE__*/React.createElement("button", {
      key: f,
      onClick: () => setFilter(f),
      style: {
        padding: '7px 14px',
        borderRadius: 9999,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        background: filter === f ? 'var(--itutor-green)' : '#fff',
        color: filter === f ? '#fff' : '#4b5563',
        border: '1px solid ' + (filter === f ? 'var(--itutor-green)' : 'var(--surface-border)')
      }
    }, f, f === 'Requests open' && open ? ' · ' + open : '')))
  }, title), shown.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    padding: "28px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 4px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, "No open requests"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#6b7280',
      maxWidth: 480,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Nobody is waiting on feedback. You can still send it unprompted from any student\u2019s row."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      marginTop: 14
    },
    onClick: () => setFilter('All')
  }, "Show everyone")) : shown.map(s => /*#__PURE__*/React.createElement(StudentRow, {
    key: s.id,
    s: s,
    showVia: showVia,
    onFeedback: onFeedback,
    onMessage: onMessage
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: '#9ca3af'
    }
  }, "Open requests sort first. Feedback is optional \u2014 most sessions produce none."));
}

/* ── 5.2 Attendance overview ─────────────────────────────────────────── */
/* A report, not a form. No checkboxes, no dropdowns, no hover-to-edit, no
   context menu, no "mark all present" — a tutor who sees an editable-looking
   cell will attempt a correction that isn't possible. */
function AttendanceOverview() {
  const all = ROSTER;
  const flat = all.flatMap(s => s.history);
  const counted = flat.filter(s => s !== 'cancelled').length;
  const up = flat.filter(s => s === 'attended' || s === 'late').length;
  const classRate = Math.round(up / counted * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement(Title, {
    sub: "CSEC Mathematics \u2014 Paper 2 Drills \xB7 Saturdays, 10:00 AM"
  }, "Attendance"), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      color: 'var(--ink)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, classRate, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "of ", counted, " sessions across the class")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, Object.entries(ATT).map(([k, a]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: '#4b5563'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 4,
      display: 'grid',
      placeItems: 'center',
      background: a.fg,
      color: '#fff',
      opacity: k === 'cancelled' ? 0.35 : 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 9,
    strokeWidth: 3
  })), a.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '220px repeat(' + SESSIONS.length + ', minmax(64px,1fr)) 120px',
      gap: 4,
      minWidth: 780
    }
  }, /*#__PURE__*/React.createElement("span", null), SESSIONS.map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: '#9ca3af',
      textAlign: 'center',
      paddingBottom: 6
    }
  }, d)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 'var(--weight-semibold)',
      color: '#9ca3af',
      textAlign: 'right',
      paddingBottom: 6
    }
  }, "In this class"), all.map(s => {
    const {
      rate,
      counted: c
    } = rateOf(s.history);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s.id
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: s.name,
      size: 26
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--ink)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, s.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 10,
        color: '#9ca3af'
      }
    }, s.form))), s.history.map((st, i) => {
      const a = ATT[st];
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          borderTop: '1px solid #f3f4f6',
          display: 'grid',
          placeItems: 'center',
          padding: '8px 0'
        }
      }, /*#__PURE__*/React.createElement("span", {
        title: a.label,
        style: {
          width: 24,
          height: 24,
          borderRadius: 6,
          display: 'grid',
          placeItems: 'center',
          background: a.bg,
          color: a.fg,
          opacity: st === 'cancelled' ? 0.55 : 1
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: a.icon,
        size: 13,
        strokeWidth: 2.6
      })));
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '8px 0',
        fontSize: 'var(--text-xs)',
        color: '#4b5563',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement("strong", null, rate, "%"), "\xA0of ", c));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      marginTop: 18,
      padding: '12px 14px',
      background: 'var(--surface-inset)',
      border: '1px solid #e5e7eb',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    color: "#6b7280"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: '#374151',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Attendance is recorded automatically from when each student joins. Lateness comes from the join time. Nobody can change a record \u2014 not you, not the parent, not iTutor support. If a student says a record is wrong, tell them what the platform recorded and why."))));
}

/* ── 5.3 Feedback template ───────────────────────────────────────────── */
function FeedbackComposer({
  student,
  onBack,
  onSend
}) {
  const s = student || ROSTER[0];
  /* platform-wide figures, tallied from the same records the parent and student
     kits tally — a rate shown in two places must never be typed twice */
  const {
    rate,
    counted
  } = rateOf(s.platformHistory);
  const t = {
    attended: 0,
    late: 0,
    absent: 0,
    cancelled: 0
  };
  s.platformHistory.forEach(x => {
    t[x] += 1;
  });
  const [note, setNote] = React.useState('');
  const [part, setPart] = React.useState(null);
  const [free, setFree] = React.useState({
    performance: '',
    focus: ''
  });
  const recipients = s.parent ? s.parent + ' and ' + s.name.split(' ')[0] : s.name.split(' ')[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Back to students"), /*#__PURE__*/React.createElement(Title, {
    sub: 'Reaches ' + recipients + '. Takes a couple of minutes.'
  }, "Feedback for ", s.name.split(' ')[0]), s.request && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '12px 14px',
      background: 'rgba(147,51,234,0.07)',
      border: '1px solid rgba(147,51,234,0.25)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square-quote",
    size: 16,
    color: "#7c3aed"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: '#5b21b6',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, s.request.by === 'parent' ? s.parent : s.name.split(' ')[0], " asked for this on ", s.request.on, "."), " They asked for a general update on how ", s.name.split(' ')[0], " is doing.")), /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 9999,
      background: 'var(--ink)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center'
    }
  }, "1"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Attendance"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    shape: "rect"
  }, "Filled in for you \xB7 not editable")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      padding: 16,
      background: 'var(--surface-inset)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: 'var(--ink)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, rate, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, "of ", counted, " sessions")), ['attended', 'late', 'absent'].map(k => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: ATT[k].fg,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, t[k]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)'
    }
  }, ATT[k].label.toLowerCase())))), /*#__PURE__*/React.createElement(Input, {
    label: "Anything the numbers miss? (optional)",
    placeholder: "The late arrival on 23 Aug was a school event, not a habit.",
    value: note,
    onChange: e => setNote(e.target.value),
    style: {
      marginTop: 12
    }
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 24,
      paddingTop: 24,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 9999,
      background: 'var(--ink)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center'
    }
  }, "2"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Did ", s.name.split(' ')[0], " participate?")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, PARTICIPATION.map(o => {
    const on = o === part;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => setPart(o),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 13px',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: on ? 'rgba(25,147,86,0.07)' : '#fff',
        border: '1px solid ' + (on ? 'var(--itutor-green)' : 'var(--surface-border)'),
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 9999,
        border: '2px solid ' + (on ? 'var(--itutor-green)' : '#d1d5db'),
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: 'var(--itutor-green)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)',
        color: on ? 'var(--ink)' : '#4b5563'
      }
    }, o));
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 24,
      paddingTop: 24,
      borderTop: '1px solid #f3f4f6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 9999,
      background: '#d1d5db',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center'
    }
  }, "3"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "In your own words"), /*#__PURE__*/React.createElement(Badge, {
    tone: "amber",
    shape: "rect",
    uppercase: true
  }, "TODO \xA77.1")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 11,
      color: '#9ca3af',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Which sections live here \u2014 performance, behaviour, focus next \u2014 and whether a star rating stays, is undecided. Two placeholders stand in; the form renders whatever the template carries."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Performance",
    placeholder: "What went well, what still slips.",
    value: free.performance,
    onChange: e => setFree(f => ({
      ...f,
      performance: e.target.value
    }))
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Focus next",
    placeholder: "What you'll work on next session.",
    value: free.focus,
    onChange: e => setFree(f => ({
      ...f,
      focus: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 11,
      color: '#9ca3af'
    }
  }, "No homework or assignment fields \u2014 iTutor does not track either, so asking for it would imply data the product cannot supply.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginTop: 24,
      paddingTop: 20,
      borderTop: '1px solid #f3f4f6',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: !part,
    onClick: onSend
  }, "Send feedback"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onBack
  }, "Save draft"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#9ca3af'
    }
  }, part ? 'Goes to ' + recipients + '.' : 'Pick a participation answer to send.'))));
}

/* ── Class shell with the Students tab ───────────────────────────────── */
const CLASS_TABS = ['Overview', 'Students', 'Attendance'];
function ClassDetail({
  onFeedback,
  onMessage
}) {
  const [tab, setTab] = React.useState('Students');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 1020
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--ink)'
    }
  }, "CSEC Mathematics \u2014 Paper 2 Drills"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)'
    }
  }, "Group class \xB7 Saturdays, 10:00 AM \xB7 4 of 12 places filled")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border)'
    }
  }, CLASS_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: '10px 14px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: tab === t ? 'var(--ink)' : '#9ca3af',
      borderBottom: '2px solid ' + (tab === t ? 'var(--itutor-green)' : 'transparent'),
      marginBottom: -1
    }
  }, t))), tab === 'Students' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--ink-muted)'
    }
  }, "The parent sits with the student\u2019s place in the roster \u2014 name only, no contact details."), ROSTER.slice().sort((a, b) => (b.request ? 1 : 0) - (a.request ? 1 : 0)).map(s => /*#__PURE__*/React.createElement(StudentRow, {
    key: s.id,
    s: s,
    onFeedback: onFeedback,
    onMessage: onMessage
  }))), tab === 'Attendance' && /*#__PURE__*/React.createElement(AttendanceOverview, null), tab === 'Overview' && /*#__PURE__*/React.createElement(Card, {
    padding: "24px",
    hoverLift: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, [['Students', 4], ['Places left', 8], ['Sessions run', 6], ['Class rate', '85% of 20']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: 'var(--ink)',
      lineHeight: 1.1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-muted)',
      marginTop: 4
    }
  }, l)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 0',
      paddingTop: 16,
      borderTop: '1px solid #f3f4f6',
      fontSize: 'var(--text-xs)',
      color: '#6b7280',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Pending parent approvals are not shown here. A booking becomes visible to you only once payment clears.")));
}
function MyStudents({
  onFeedback,
  onMessage
}) {
  return /*#__PURE__*/React.createElement(Roster, {
    students: ROSTER.concat(ONE_TO_ONES),
    title: "My Students",
    sub: "Everyone you teach \u2014 group classes and 1:1 arrangements together.",
    showVia: true,
    onFeedback: onFeedback,
    onMessage: onMessage
  });
}
function TutorMessages({
  student,
  onBack
}) {
  const s = student || ROSTER[0];
  const toParent = !!s.parent;
  const who = toParent ? s.parent : s.name;
  const [draft, setDraft] = React.useState('');
  const [sent, setSent] = React.useState([]);
  const base = toParent ? [{
    from: 'them',
    at: '22 Aug, 8:30 PM',
    text: 'Josiah was late again — that\u2019s on us, traffic from San Fernando. Could we move him to 6:00 PM?'
  }, {
    from: 'me',
    at: '23 Aug, 9:02 AM',
    text: '6:00 PM works better for me too. I\u2019ve moved the recurring slot.'
  }] : [{
    from: 'them',
    at: '2 Sep, 7:14 PM',
    text: 'Miss, could you look at my working for question 5?'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-muted)',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Back to students"), /*#__PURE__*/React.createElement(Title, {
    sub: toParent ? 'Parent of ' + s.name + ' · ' + s.via : s.form + ' · ' + s.via
  }, who), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    hoverLift: false,
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: 460
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'grid',
      gap: 12,
      alignContent: 'start',
      background: 'var(--surface-inset)'
    }
  }, base.concat(sent).map((m, i) => {
    const mine = m.from === 'me';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '72%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        background: mine ? 'var(--itutor-green)' : '#fff',
        color: mine ? '#fff' : '#374151',
        border: mine ? 'none' : '1px solid #e5e7eb',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        color: '#9ca3af',
        textAlign: mine ? 'right' : 'left'
      }
    }, m.at)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 12,
      borderTop: '1px solid #f3f4f6',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: 'Message ' + who.split(' ')[0] + '…',
    value: draft,
    onChange: e => setDraft(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      if (draft.trim()) {
        setSent(x => x.concat({
          from: 'me',
          at: 'Just now',
          text: draft
        }));
        setDraft('');
      }
    },
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 14,
      color: "#fff"
    })
  }, "Send"))), !toParent && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: '#9ca3af'
    }
  }, s.name.split(' ')[0], " has no linked parent, so this thread goes to the student."));
}
Object.assign(window, {
  ClassDetail,
  MyStudents,
  AttendanceOverview,
  FeedbackComposer,
  TutorMessages,
  StudentRow,
  Roster,
  TUTOR_ROSTER: ROSTER
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tutor-app/TutorSpec.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.StarRating = __ds_scope.StarRating;

__ds_ns.SubjectPill = __ds_scope.SubjectPill;

__ds_ns.VerifiedBadge = __ds_scope.VerifiedBadge;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.GroupCard = __ds_scope.GroupCard;

__ds_ns.SidebarNavItem = __ds_scope.SidebarNavItem;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StepCard = __ds_scope.StepCard;

__ds_ns.TutorCard = __ds_scope.TutorCard;

})();
