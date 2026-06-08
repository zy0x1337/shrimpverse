import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

interface Props {
  hasActiveFamily: boolean;
}

export function EffectPipeline({ hasActiveFamily }: Props) {
  return (
    <EffectComposer multisampling={4}>
      {/* Bloom — makes colored shrimp nodes glow like LEDs in water */}
      <Bloom
        intensity={hasActiveFamily ? 2.2 : 1.4}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.7}
      />
      {/* Depth of Field — background softens, focused node is sharp */}
      <DepthOfField
        focusDistance={hasActiveFamily ? 0.015 : 0.008}
        focalLength={0.07}
        bokehScale={hasActiveFamily ? 4 : 2.5}
        height={700}
      />
      {/* Vignette — aquarium glass edge darkening */}
      <Vignette
        eskil={false}
        offset={0.12}
        darkness={0.65}
      />
      {/* Very subtle chromatic aberration — wet glass look */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0006, 0.0006)}
        radialModulation={true}
        modulationOffset={0.65}
      />
    </EffectComposer>
  );
}
