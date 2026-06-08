import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

export function EffectPipeline({ hasActiveFamily }: { hasActiveFamily: boolean }) {
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        intensity={hasActiveFamily ? 1.4 : 0.85}
        luminanceThreshold={0.45}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.55}
      />
      <Vignette
        eskil={false}
        offset={0.18}
        darkness={0.75}
      />
    </EffectComposer>
  );
}
