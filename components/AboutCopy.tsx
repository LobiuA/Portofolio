export default function AboutCopy({ paras }: { paras: string[] }) {
  return (
    <div>
      {paras.map((p, idx) => (
        <p
          key={idx}
          style={idx === 0 ? { marginTop: 22 } : undefined}
          dangerouslySetInnerHTML={{ __html: p }}
        />
      ))}
    </div>
  )
}
