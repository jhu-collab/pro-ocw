"use client";
import Logo from "@/components/app/Logo";
import Footer from "@/components/home/Footer";
import Head from "@/components/home/Head";
import Header from "@/components/home/Header";
import MDX from "@/components/home/mdx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import cn from "@/lib/cn";
import { sluggifyTitle } from "@/lib/contentUtils";
import type { DocHeading } from "contentlayer.config";
import { Coursebook, allCoursebooks } from "contentlayer/generated";
import { capitalize } from "lodash";
import { SidebarClose, SidebarOpen } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";

type TOCTreeNode = {
  title: string | null;
  href: string | null;
  children: TOCTreeNode[];
};

const constructTOC = (
  coursebooks: Coursebook[],
  title: string | null
): TOCTreeNode => {
  const coursebook = coursebooks[0];
  if (
    coursebook &&
    coursebooks.length === 1 &&
    coursebook.pathSegments.length === 0
  ) {
    return {
      title: title ?? coursebook.title,
      href: "/" + coursebook.url_path,
      children: [],
    };
  }

  const indexDoc = coursebooks.find((d) => d.pathSegments.length === 0);
  const remainingDocs = coursebooks.filter((d) => d.pathSegments.length > 0);

  const children = Array.from(
    remainingDocs
      .map((d) => d.pathSegments[0])
      .sort((a, b) => a.order - b.order)
      .reduce<string[]>((acc, cur) => {
        if (!acc.some((name) => name === cur.name)) {
          acc.push(cur.name);
        }
        return acc;
      }, [])
  );

  return {
    title: indexDoc?.title ?? title ?? "Untitled",
    href: indexDoc?.url_path ? "/" + indexDoc.url_path : null,
    children: children.map((c) => {
      const relevantDocs = remainingDocs
        .filter((d) => d.pathSegments[0].name === c)
        .map((d) => ({ ...d, pathSegments: d.pathSegments.slice(1) }));

      return constructTOC(relevantDocs, capitalize(c).replaceAll("-", " "));
    }),
  };
};

type PathSegment = { order: number; name: string };

const HeadingsSidebar: FC<{ headings: DocHeading[] }> = ({ headings }) => {
  const headingsToRender = headings.filter((h) => h.level > 1);

  if ((headingsToRender ?? []).length === 0) return null;

  return (
    <>
      <h4 className="mb-4 font-medium">On this page</h4>
      <ul className="space-y-2">
        {headingsToRender.map(({ title, level }, index) => {
          return (
            <li key={index}>
              <a
                href={`#${sluggifyTitle(title)}`}
                style={{ marginLeft: (level - 2) * 16 }}
                className={cn(
                  "flex text-gray-600 transition hover:text-gray-900"
                )}
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const TOCItem: React.FC<{
  node: TOCTreeNode;
  level?: number;
  onNav?: () => void;
}> = ({ node, level = 0, onNav }) => {
  const pathname = usePathname();

  const hasChildren = node.children.length > 0;

  const row = (
    <p
      className={cn("rounded-md py-1 pl-4", {
        "mt-3": level === 1 && hasChildren,
        "mt-1": level > 1 && hasChildren,
        "font-medium": hasChildren,
        "transition hover:bg-gray-200": !!node.href,
        "cursor-default select-none": !node.href,
        "bg-gray-100": pathname === node.href,
      })}
    >
      {node.title}
    </p>
  );

  return (
    <>
      {node.href ? (
        <NextLink href={node.href} onClick={onNav}>
          {row}
        </NextLink>
      ) : (
        row
      )}
      <div
        className={cn({
          "ml-4": level > 0,
        })}
      >
        {node.children.map((child, index) => (
          <TOCItem level={level + 1} key={index} node={child} onNav={onNav} />
        ))}
      </div>
    </>
  );
};

const Coursebook = ({
  params,
}: {
  params: {
    slug: string[];
  };
}) => {
  const { slug } = params;
  const pagePath = (slug && slug.join("/")) ?? "";

  const coursebook = allCoursebooks.find(
    (d) =>
      d.pathSegments.map((ps: PathSegment) => ps.name).join("/") === pagePath
  );

  if (!coursebook) {
    throw new Error(`No coursebook found for slug: ${slug}`);
  }

  const currentCoursebook = allCoursebooks.filter(
    (d) => d.pathSegments[0].name === slug[0]
  );

  const toc = constructTOC(currentCoursebook, "Table of Contents");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative">
      <Head
        title={coursebook.title}
        description={coursebook.excerpt}
        image={""}
      />
      <Button
        className="fixed bottom-8 right-8 z-10 h-16 w-16 rounded-full shadow-xl-outline md:hidden"
        onClick={() => setMobileSidebarOpen((x) => !x)}
      >
        {mobileSidebarOpen ? (
          <SidebarClose className="w-6" />
        ) : (
          <SidebarOpen className="w-6" />
        )}
      </Button>
      <div className="sticky top-0 z-10 flex w-full items-center border-b border-gray-200 bg-white">
        <Header fullWidth />
      </div>
      <div className="mx-auto flex max-w-[90rem]">
        {/* desktop nav tree */}
        <aside className="sticky top-20 hidden h-full shrink-0 overflow-auto px-4 py-5 md:block md:w-[320px]">
          <TOCItem node={toc} onNav={() => setMobileSidebarOpen(false)} />
        </aside>
        {/* mobile nav tree */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 h-full w-full animate-fadeIn bg-gray-500 opacity-50 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-2/3 max-w-[320px] animate-slideRightAndFadeIn bg-white p-4 md:hidden">
              <Logo variant="wordmark" className="" />
              <div className="h-8" />
              <TOCItem node={toc} onNav={() => setMobileSidebarOpen(false)} />
            </div>
          </>
        )}
        <article
          className={cn(
            "relative flex h-full min-h-screen w-full justify-between overflow-auto px-4 pt-0 pb-20 md:px-8"
          )}
        >
          <div className="w-full">
            <MDX content={coursebook.body.code} />
          </div>
        </article>
        <nav className="sticky top-20 hidden h-full shrink-0 overflow-auto px-4 py-5 md:w-[280px] lg:block">
          <HeadingsSidebar headings={coursebook.headings} />
        </nav>
      </div>
      <Separator />
      <Footer />
    </div>
  );
};

export default Coursebook;
