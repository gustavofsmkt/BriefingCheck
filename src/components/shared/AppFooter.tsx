export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-zinc-800/70 px-6 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-7 md:grid-cols-2">
        <div>
          <p className="mb-2 text-base font-black tracking-tight text-white">BriefingCheck</p>
          <p className="text-sm text-zinc-500">© 2026 BriefingCheck. Intelligence-driven validation.</p>
        </div>

        <div className="flex flex-wrap gap-6 md:justify-end">
          <a className="text-sm text-zinc-500 transition-colors hover:text-white" href="#">
            Privacidade
          </a>
          <a className="text-sm text-zinc-500 transition-colors hover:text-white" href="#">
            Termos
          </a>
          <a className="text-sm text-zinc-500 transition-colors hover:text-white" href="#">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
