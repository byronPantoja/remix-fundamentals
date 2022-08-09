import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { createPost } from "~/models/post.server";
import { redirect, json } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? undefined : "Title is required",
    slug: slug ? undefined : "Slug is required",
    markdown: markdown ? undefined : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some(Boolean);
  if (hasErrors) {
    return json({ errors });
  }

  await createPost({ title, slug, markdown });
  return redirect("/posts/admin");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const actionData = useActionData<typeof action>();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} />
          {actionData?.errors?.title ? (
            <em className="text-red-600">{actionData.errors.title}</em>
          ) : null}
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input type="text" name="slug" className={inputClassName} />
          {actionData?.errors?.slug ? (
            <em className="text-red-600">{actionData.errors.title}</em>
          ) : null}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <br />
        <textarea
          id="markdown"
          rows={8}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
        {actionData?.errors?.markdown ? (
          <em className="text-red-600">{actionData.errors.title}</em>
        ) : null}
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
