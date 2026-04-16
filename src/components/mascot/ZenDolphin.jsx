import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

const LOTTIE_SRC = "/dolphin_full_system/onboarding.json";

export function ZenDolphin({ size = 200, mood: _mood = "default", bob = false }) {
  const [animData, setAnimData] = useState(null);

  useEffect(() => {
    fetch(LOTTIE_SRC)
      .then(r => r.json())
      .then(setAnimData)
      .catch(() => setAnimData(null));
  }, []);

  return (
    <div
      style={{
        width: size,
        height: size,
        animation: bob ? "zenBob 3s ease-in-out infinite" : undefined,
      }}
    >
      {animData && (
        <Lottie
          animationData={animData}
          renderer="svg"
          loop={true}
          autoplay={true}
          style={{ width: size, height: size, background: 'transparent' }}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true }}
        />
      )}
    </div>
  );
}
