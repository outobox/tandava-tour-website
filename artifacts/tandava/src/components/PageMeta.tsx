import { useEffect } from "react";

interface Props {
  title: string;
  description?: string;
}

export function PageMeta({ title, description }: Props) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;

    let metaDesc: HTMLMetaElement | null = null;
    let prevDesc: string | null = null;
    if (description) {
      metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        prevDesc = metaDesc.getAttribute("content");
        metaDesc.setAttribute("content", description);
      }
    }

    return () => {
      document.title = previous;
      if (metaDesc && prevDesc !== null) {
        metaDesc.setAttribute("content", prevDesc);
      }
    };
  }, [title, description]);

  return null;
}
