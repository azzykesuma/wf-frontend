"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

type Status = "idle" | "loading" | "success" | "error";

type LoginResponse = {
  authenticated?: unknown;
  message?: unknown;
};

type LoginValues = {
  email: string;
  password: string;
};

async function login(values: LoginValues) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const payload = (await response.json().catch(() => ({}))) as LoginResponse;

  if (!response.ok) {
    const message =
      typeof payload.message === "string" && payload.message.length > 0
        ? payload.message
        : "Unable to sign in.";

    throw new Error(message);
  }

  return payload;
}

export function LoginForm() {
  const router = useRouter();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.replace("/");
      router.refresh();
    },
  });

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: Partial<LoginValues> = {};

      if (!values.email.trim()) {
        errors.email = "Email is required.";
      }

      if (!values.password) {
        errors.password = "Password is required.";
      }

      return errors;
    },
    onSubmit: (values) => {
      loginMutation.mutate({
        email: values.email.trim(),
        password: values.password,
      });
    },
  });

  const validationMessage =
    formik.submitCount > 0
      ? formik.errors.email ?? formik.errors.password ?? ""
      : "";
  const mutationMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : "";
  const errorMessage = mutationMessage || validationMessage;
  const status: Status = loginMutation.isPending
    ? "loading"
    : loginMutation.isSuccess
      ? "success"
      : errorMessage
        ? "error"
        : "idle";

  function updateField(field: keyof LoginValues, value: string) {
    if (loginMutation.isError) {
      loginMutation.reset();
    }

    formik.setFieldValue(field, value);
  }

  const buttonContent = {
    idle: (
      <>
        <span>INITIALIZE SESSION</span>
        <span className="text-lg leading-none">▶</span>
      </>
    ),
    loading: (
      <>
        <LoadingDots />
        <span>AUTHENTICATING</span>
      </>
    ),
    success: (
      <>
        <span>SESSION ACTIVE</span>
        <span className="text-base leading-none">✓</span>
      </>
    ),
    error: (
      <>
        <span>AUTH FAILED</span>
        <span className="text-base leading-none">✕</span>
      </>
    ),
  };

  const buttonColors = {
    idle: "from-[#00b8cc] via-[#00e5ff] to-[#00b8cc]",
    loading: "from-[#005f6b] via-[#007a8a] to-[#005f6b]",
    success: "from-[#00663a] via-[#00994d] to-[#00663a]",
    error: "from-[#7a1a1a] via-[#cc2222] to-[#7a1a1a]",
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      {/* System status bar */}
      <div className="mb-8 flex items-center gap-2">
        <span
          className="font-mono text-[9px] tracking-[0.2em] text-[rgba(180,220,255,0.6)]"
          style={{ fontFamily: "Share Tech Mono, monospace" }}
        >
          SYS.AUTH
        </span>
        <div className="relative flex-1 h-0.5 bg-[rgba(0,229,255,0.1)] overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[72%] bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]" />
          <motion.div
            className="absolute inset-y-0 w-[30%] bg-linear-to-r from-transparent via-[rgba(0,229,255,0.8)] to-transparent"
            animate={{ left: ["-30%", "130%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span
          className="font-mono text-[9px] tracking-[0.2em] text-[rgba(180,220,255,0.6)]"
          style={{ fontFamily: "Share Tech Mono, monospace" }}
        >
          72%
        </span>
      </div>

      {/* Auth header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="text-[10px] tracking-[0.3em] text-[#00e5ff]"
            style={{ fontFamily: "Share Tech Mono, monospace" }}
          >
            SECURE CHANNEL
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-[#00e5ff] to-transparent" />
        </div>
        <h2
          className="text-[1.8rem] font-black tracking-wider text-white mb-1"
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          SIGN IN
        </h2>
        <p
          className="text-[11px] leading-relaxed tracking-[0.08em] text-[rgba(180,220,255,0.6)]"
          style={{ fontFamily: "Share Tech Mono, monospace" }}
        >
          Access your market workspace
          <br />
          and manage trade activity.
        </p>
      </div>

      {/* Email field */}
      <Field
        id="email"
        label="IDENTIFIER"
        labelRight="EMAIL"
        type="email"
        placeholder="TENNO_ID@RELAY.NET"
        value={formik.values.email}
        onChange={(value) => updateField("email", value)}
        focused={focusedField === "email"}
        onFocus={() => setFocusedField("email")}
        onBlur={() => {
          formik.setFieldTouched("email", true);
          setFocusedField(null);
        }}
      />

      {/* Password field */}
      <Field
        id="password"
        label="AUTH KEY"
        labelRight={
          <a
            href="#"
            className="text-[9px] tracking-[0.15em] text-[rgba(180,220,255,0.6)] uppercase border-b border-transparent hover:text-[#00e5ff] hover:border-[#00e5ff] transition-colors"
            style={{ fontFamily: "Share Tech Mono, monospace" }}
          >
            RECOVER?
          </a>
        }
        type="password"
        placeholder="••••••••••••"
        value={formik.values.password}
        onChange={(value) => updateField("password", value)}
        focused={focusedField === "password"}
        onFocus={() => setFocusedField("password")}
        onBlur={() => {
          formik.setFieldTouched("password", true);
          setFocusedField(null);
        }}
      />

      {/* Hex separator */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-[rgba(0,229,255,0.25)]" />
        <div
          className="h-3.5 w-3 bg-[rgba(0,229,255,0.25)]"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />
        <div className="flex-1 h-px bg-[rgba(0,229,255,0.25)]" />
      </div>

      {/* CTA Button */}
      <motion.button
        type="submit"
        className="relative w-full overflow-hidden cursor-pointer"
        whileTap={{ scale: 0.98 }}
        disabled={loginMutation.isPending}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`relative flex items-center justify-center gap-3 bg-linear-to-r ${buttonColors[status]} bg-size-[200%_100%] px-6 py-4 font-black tracking-[0.35em] text-[12px] text-[#050c14] uppercase`}
            style={{
              fontFamily: "Orbitron, monospace",
              clipPath:
                "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
              }}
              animate={
                status === "idle"
                  ? { backgroundPosition: ["-100% 0", "200% 0"] }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {buttonContent[status]}
          </motion.div>
        </AnimatePresence>
      </motion.button>
      {errorMessage ? (
        <p
          className="mt-4 text-[10px] tracking-[0.14em] text-[#ff5c5c] uppercase"
          style={{ fontFamily: "Share Tech Mono, monospace" }}
        >
          {errorMessage}
        </p>
      ) : null}

    </form>
  );
}

// ── FIELD ──────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  labelRight?: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

function Field({
  id,
  label,
  labelRight,
  type,
  placeholder,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
}: FieldProps) {
  return (
    <div className="mb-5">
      <div
        className="mb-2 flex items-center justify-between text-[10px] tracking-[0.25em] uppercase"
        style={{ fontFamily: "Share Tech Mono, monospace" }}
      >
        <motion.span
          className="text-[#00e5ff]"
          animate={focused ? { x: [0, 2, -2, 1, 0] } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {label}
        </motion.span>
        <span>{labelRight}</span>
      </div>

      <div className="relative">
        {/* Left border accent */}
        <motion.div
          className="absolute inset-y-0 left-0 w-0.5"
          animate={{
            background: focused
              ? "rgba(0,229,255,0.9)"
              : "rgba(0,229,255,0.4)",
            boxShadow: focused
              ? "0 0 8px rgba(0,229,255,0.6)"
              : "none",
          }}
          transition={{ duration: 0.2 }}
        />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="off"
          className="w-full border border-l-0 bg-[rgba(0,229,255,0.04)] px-5 py-3.5 text-[13px] tracking-widest text-white outline-none placeholder:text-[rgba(0,229,255,0.2)] transition-all duration-200 focus:bg-[rgba(0,229,255,0.07)] focus:border-[rgba(0,229,255,0.6)]"
          style={{
            fontFamily: "Share Tech Mono, monospace",
            borderColor: focused
              ? "rgba(0,229,255,0.6)"
              : "rgba(0,229,255,0.25)",
            clipPath:
              "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
          }}
        />

        {/* Top-right corner notch */}
        <div
          className="pointer-events-none absolute right-0 top-0 border-r-10 border-t-10 border-l-transparent border-solid"
          style={{
            borderRightColor: focused
              ? "rgba(0,229,255,0.6)"
              : "rgba(0,229,255,0.25)",
            borderTopColor: "transparent",
            borderLeftWidth: "10px",
            borderLeftColor: "transparent",
          }}
        />
      </div>
    </div>
  );
}

// ── LOADING DOTS ──────────────────────────────────────
function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1 w-1 rounded-full bg-[#050c14]"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}
