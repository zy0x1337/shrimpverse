import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

/**
 * Premium pipeline — the guiding principle:
 * less is more. Two effects only.
 *
 * Bloom: tight, luminance-gated. Only the actual emissive
 * node cores glow — nothing else bleeds light.
 *
 * Vignette: strong enough to frame the scene like a macro
 * aquarium photo, subtle enough to be invisible consciously.
 *
 * Removed: DepthOfField (flickers on resize, fights OrbitControls),
 * ChromaticAberration (reads as artifacting at low values, cliché at high).
 */
export function EffectPipeline({ hasActiveFamily }: { hasActiveFamily: boolean }) {
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        intensity={hasActiveFamily ? 0.9 : 0.55}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.45}
      />
      <Vignette
        eskil={false}
        offset={0.18}
        darkness={0.72}
      />
    </EffectComposer>
  );
}
