import Link from "next/link";

export default function Header() {
  return (
    <header style={styles.header}>
      <Link href="/" style={styles.logo}>
        Forex<span style={styles.gold}>4Ever</span>
      </Link>

      <nav style={styles.nav}>
        <Link href="/" style={styles.link}>الرئيسية</Link>
        <Link href="/academy" style={styles.link}>الأكاديمية</Link>
        <Link href="/live" style={styles.link}>البث المباشر</Link>
        <Link href="/markets" style={styles.link}>الأسواق</Link>
        <Link href="/news" style={styles.link}>الأخبار</Link>
        <Link href="/login" style={styles.login}>تسجيل الدخول</Link>
        <Link href="/signup" style={styles.signup}>إنشاء حساب</Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    padding: "14px 5%",
    background: "#080d18",
    borderBottom: "1px solid rgba(212, 175, 55, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    boxSizing: "border-box",
  },

  logo: {
    color: "#ffffff",
    fontSize: "25px",
    fontWeight: "bold",
    textDecoration: "none",
  },

  gold: {
    color: "#d4af37",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
  },

  login: {
    color: "#d4af37",
    textDecoration: "none",
    fontSize: "15px",
  },

  signup: {
    color: "#080d18",
    background: "#d4af37",
    padding: "8px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "bold",
  },
};
