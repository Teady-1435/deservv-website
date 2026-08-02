export default function Logo({ size = 21 }: { size?: number }) {
  return (
    <span
      className="font-display font-bold inline-flex items-baseline leading-none"
      style={{ fontSize: size, letterSpacing: "-0.02em" }}
    >
      Deser
      <span className="text-red inline-flex items-baseline" style={{ letterSpacing: "-0.05em" }}>
        <span className="inline-block" style={{ fontSize: "0.8em", transform: "translateY(0.05em)" }}>
          v
        </span>
        <span className="inline-block" style={{ fontSize: "1.3em", transform: "translateY(-0.17em)" }}>
          v
        </span>
      </span>
    </span>
  );
}
