import Image from 'next/image';

interface SceneHeroArtProps {
  src: string;
  alt: string;
}

export function SceneHeroArt({ src, alt }: SceneHeroArtProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes='100vw'
      className='scene-hero-art'
    />
  );
}
