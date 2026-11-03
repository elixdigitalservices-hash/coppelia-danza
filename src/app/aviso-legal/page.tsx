import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { legal, studio } from "@/data/site";

export const metadata: Metadata = {
  title: "Aviso legal y privacidad",
  description: "Datos del titular de la web de Studio de Danza Coppelia, condiciones de uso y tratamiento de datos personales.",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: false },
};

const sections = [
  {
    title: "Uso de la web",
    body: [
      "Esta web tiene carácter informativo. Acceder a ella y navegar por sus páginas implica aceptar estas condiciones de uso, pero no supone por sí solo ninguna relación comercial con la escuela.",
      "Los textos, fotografías, vídeos, logotipos y diseño de la web pertenecen a Studio de Danza Coppelia o a sus autores, que aparecen citados junto a su obra. No se pueden reproducir sin permiso.",
    ],
  },
  {
    title: "Protección de datos",
    body: [
      `Si nos escribes por WhatsApp, por teléfono o por correo electrónico, ${legal.holder} tratará tus datos para responder a tu consulta y, si te matriculas, para gestionar la relación con la escuela. No los cedemos a terceros salvo obligación legal.`,
      `Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${legal.email} o a la dirección postal indicada arriba. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).`,
    ],
  },
  {
    title: "Cookies y servicios externos",
    body: [
      "Esta web no usa cookies propias de publicidad ni de análisis. El mapa de Google de la página de contacto y los vídeos de YouTube y Vimeo (que solo se cargan al darles al play) son servicios externos que pueden usar sus propias cookies según sus políticas.",
    ],
  },
];

export default function AvisoLegalPage() {
  return (
    <>
      <Header />
      <main className="bg-noche pt-[4.5rem]">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8 lg:pb-32 lg:pt-24">
          <h1 className="display text-[clamp(3rem,8vw,5.6rem)]">Aviso legal</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            En cumplimiento de la Ley 34/2002 de servicios de la sociedad de la información (LSSI), estos son los datos del titular de la web.
          </p>

          <dl className="mt-10 grid gap-5 rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-6 sm:grid-cols-2 sm:p-8">
            {[
              ["Titular", legal.holder],
              ["NIF", legal.taxId],
              ["Domicilio", legal.address],
              ["Correo electrónico", legal.email],
              ["Teléfono", studio.phone],
              ["Centro", `${studio.name} · ${studio.street} · ${studio.postalCode} ${studio.city} (${studio.region})`],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">{term}</dt>
                <dd className="mt-1.5">{value}</dd>
              </div>
            ))}
          </dl>

          {sections.map((section) => (
            <section key={section.title} className="mt-14">
              <h2 className="display text-[clamp(1.9rem,3.4vw,2.6rem)]">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-4 leading-relaxed text-white/70">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
