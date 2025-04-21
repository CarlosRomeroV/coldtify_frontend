import { JSX } from "react";
import "../styles/nameEffects.css";

export function applyNameEffect(name: string, effect: number): JSX.Element {
  switch (effect) {
    case 2: // 🌈 Arcoíris animado lento
      return (
        <span className="rainbow-text-slow">
          {name.split("").map((char, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.3}s` }}>
              {char}
            </span>
          ))}
        </span>
      );
    case 3: // ✨ Dorado brillante (fluido como silver)
      return (
        <span className="gold-effect">
          {name.split("").map((char, i) => (
            <span key={i}>{char}</span> // ❌ sin delay
          ))}
        </span>
      );
    
    case 4: // 🪙 Efecto plateado brillante
      return (
        <span className="silver-effect">
          {name.split("").map((char, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.4}s` }}>
              {char}
            </span>
          ))}
        </span>
      );


    default:
      return <span>{name}</span>;
  }
}
