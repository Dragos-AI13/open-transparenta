export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-xs text-text-muted">
          Date preluate de la peste 100 de instituții publice din România.
        </p>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <a
            href="https://github.com/Dragos-AI13/open-transparenta"
            className="hover:text-text-secondary transition-colors"
          >
            GitHub
          </a>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}
