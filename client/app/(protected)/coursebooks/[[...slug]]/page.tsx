import { glob } from "glob";
import path from "path";
import fs from "fs";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import TableOfContents from "../../../../components/coursebook/table.of.contents";
import matter from "gray-matter";
import { Metadata } from "next";
import { components, config } from "../../../../markdoc.config";
import { notFound } from "next/navigation";

const POSTS_DIR = path.join(process.cwd(), "coursebooks");

type Params = {
  slug: string[];
};

type PageProps = {
  params: Params;
};

export const dynamicParams = false;

function getMarkdownContent(slug: string[]) {
  const joinedSlug = slug.join(path.sep);
  let filePath = path.join(POSTS_DIR, joinedSlug);
  const pathExists = fs.existsSync(filePath);
  const fileExists = fs.existsSync(filePath + ".md");
  if (!pathExists && !fileExists) {
    notFound();
  }
  if (pathExists && fs.lstatSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.md"); // look for index.md in the directory
  } else {
    filePath = filePath + ".md"; // look for .md file
  }
  let source;
  try {
    source = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    notFound();
  }
  const matterResult = matter(source);
  const { title, type } = matterResult.data;
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, config);
  return { content, title };
}

function extractHeadings(node: any, sections: any[] = []) {
  if (node) {
    if (node.name === "Heading") {
      const title = node.children[0];

      if (typeof title === "string") {
        sections.push({
          ...node.attributes,
          title,
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        extractHeadings(child, sections);
      }
    }
  }

  return sections;
}

export default async function CoursebookPage({ params }: PageProps) {
  const { content } = await getMarkdownContent(params.slug);
  const tableOfContents = extractHeadings(content);

  return (
    <>
      {Markdoc.renderers.react(content, React, { components })}
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
}
