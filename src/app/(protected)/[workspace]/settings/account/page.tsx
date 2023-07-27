"use client"

import { type ChangeEvent, useEffect, useState, use } from "react"
import { api, useAction } from "~/trpc/client"
import {
  createPresignedUrlAction,
  updateUserAvatarAction,
} from "~/app/(protected)/[workspace]/settings/account/actions"
import useAsyncEffect from "use-async-effect"
import useQuery from "~/hooks/useQuery"

export default function AccountPage() {
  const user = useQuery(api.user.getUser.query())
  const [selectedFile, setSelectedFile] = useState<File>()
  const [preview, setPreview] = useState<string>()

  const { mutate: createPresignedUrlMutation, data: presignedUrlData } =
    useAction(createPresignedUrlAction)
  const { mutate: updateUserAvatarMutation } = useAction(updateUserAvatarAction)

  useAsyncEffect(async () => {
    if (!(presignedUrlData && selectedFile)) return

    const formData = new FormData()
    for (const [key, value] of Object.entries(presignedUrlData.fields)) {
      formData.append(key, value)
    }
    formData.append("file", selectedFile)
    const resp = await fetch(presignedUrlData.url, {
      method: "POST",
      body: formData,
    })

    if (!resp.ok) return

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const key = presignedUrlData.fields.key!
    updateUserAvatarMutation({
      avatar: `https://collama-public-image.s3.ap-southeast-1.amazonaws.com/${key}`,
    })
  }, [presignedUrlData, selectedFile])

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  return (
    <div>
      <h3>Account page</h3>
      <input type="file" onChange={onSelectFile} accept=".jpg,.jpeg,.png" />
      {user?.avatar && <img src={user?.avatar} alt="avatar" />}
      {selectedFile && <img src={preview} alt="avatar" />}
      <button
        onClick={() => {
          if (!selectedFile) return

          createPresignedUrlMutation({
            filetype: selectedFile.type,
          })
        }}
      >
        Upload
      </button>
    </div>
  )
}
