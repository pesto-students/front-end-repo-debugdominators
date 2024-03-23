import React, { useState } from "react";
// import Plus from "../../../../public/general/Plus.svg";
import { message, Modal, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import Image from "next/image";
import { UplaodField } from "@/utils/types/state";
import { PlusOutlined } from "@ant-design/icons";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AntUpload: React.FC<UplaodField> = ({
  type,
  maxCount,
  value,
  setImage,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1),
    );
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    if (newFileList && newFileList.length > 0) {
      if (type.find((elm) => elm === newFileList[0]?.type)) {
        const response = await getBase64(
          newFileList[0]?.originFileObj as FileType,
        );
        setImage(response);
        return setFileList(newFileList);
      }
      setImage("");
      message.error(`Please choose a image file.`);
      return setFileList([]);
    }
    setImage("");
    message.info(`Current image file removed, Please choose other.`);
    return setFileList([]);
  };

  // const uploadButton = (
  //   <button
  //     className="flex-col"
  //     style={{ border: 0, background: "none" }}
  //     type="button"
  //   >
  //     <div className="flex justify-center">
  //       <Image width={15} src={Plus} alt="plus" />
  //     </div>
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </button>
  // );

  return (
    <>
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={maxCount}
      >
        {/* {fileList.length >= 8 ? null : uploadButton} */}
        {fileList.length === 0 && value ? (
          <Image
            style={{ borderRadius: "25px" }}
            width={100}
            height={100}
            src={value}
            alt="Preview"
          />
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default AntUpload;
