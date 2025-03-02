import { type CustomResponse } from "@refinedev/core";

import { Client, type ClientParams } from "@/client";

import { Doc } from "../dataTypes";

interface UploadFileProps extends ClientParams {
  file: File;
  isPrivate: boolean;
  folder?: string;
  fileUrl?: string;
  doctype?: string;
  docname?: string;
  fieldname?: string;

  onUploadPercentProgress?: (percentCompleted: number) => void;
}

interface FileDocType {
  attached_to_doctype: string;
  attached_to_name: string;
  content_hash: string;
  file_name: string;
  file_size: number;
  file_url: string;
  folder: string;
  idx: number;
  is_attachments_folder: number;
  is_folder: number;
  is_home_folder: number;
  is_private: number;
  uploaded_to_dropbox: number;
  uploaded_to_google_drive: number;
}

type UploadFileReturn = CustomResponse<Doc<FileDocType>>;

const uploadFile = async (props: UploadFileProps): Promise<UploadFileReturn> => {
  const {
    axiosConfig, url,

    onUploadPercentProgress,

    docname, doctype,
    fieldname,
    file, fileUrl, folder,
    isPrivate,
  } = props;

  const { instance } = new Client({
    axiosConfig, url,
  });

  const formData = new FormData();

  formData.append("file", file, file.name);
  if (isPrivate) {
    formData.append("is_private", "1");
  }
  if (folder) {
    formData.append("folder", folder);
  }
  if (fileUrl) {
    formData.append("file_url", fileUrl);
  }
  if (doctype && docname) {
    formData.append("doctype", doctype);
    formData.append("docname", docname);
    if (fieldname) {
      formData.append("fieldname", fieldname);
    }
  }

  const { data } = await instance.request<Doc<FileDocType>>({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      if (total && onUploadPercentProgress) {
        const percentCompleted = Math.round(
          (loaded / total) * 100,
        );
        onUploadPercentProgress(percentCompleted);
      }
    },

    data: formData,
    method: "post",
    url: "/api/method/upload_file",
  });

  return { data };
};

export {
  uploadFile,
  type FileDocType,
  type UploadFileProps,
  type UploadFileReturn,
};
