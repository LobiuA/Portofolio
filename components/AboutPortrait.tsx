import Image from 'next/image'

export default function AboutPortrait({
  src,
  blurDataURL,
}: {
  src: string
  blurDataURL?: string
}) {
  return (
    <div className="about-portrait" data-reveal="">
      <div className="about-portrait-frame">
        <div className="about-portrait-inner">
          <Image
            src={src}
            alt="Tri Muhammad Jidan portrait"
            width={742}
            height={1011}
            sizes="(max-width: 880px) 100vw, 42vw"
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
          />
        </div>
      </div>
    </div>
  )
}
