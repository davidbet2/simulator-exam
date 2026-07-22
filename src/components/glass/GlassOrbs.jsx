/**
 * GlassOrbs — orbes decorativos difuminados del diseño Glassmorphism (spec 02).
 * Círculos 400–480px con blur(35px) en indigo/violeta al 25% de alpha,
 * fieles a los "orb" de certzen.html. Solo decoración: aria-hidden y sin eventos.
 *
 * Responsive (inferido, no viene del diseño): en mobile solo se renderizan
 * 2 orbes para limitar capas con blur y no degradar el scroll.
 */
export function GlassOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-36 top-16 h-[27.5rem] w-[27.5rem] rounded-full bg-zen/25 blur-[35px]" />
      <div className="absolute -right-24 top-36 h-[25rem] w-[25rem] rounded-full bg-zen-violet/25 blur-[35px]" />
      <div className="absolute left-20 top-[61rem] hidden h-[30rem] w-[30rem] rounded-full bg-zen-violet/25 blur-[35px] md:block" />
      <div className="absolute -right-16 top-[102rem] hidden h-[27.5rem] w-[27.5rem] rounded-full bg-zen/25 blur-[35px] md:block" />
    </div>
  );
}
