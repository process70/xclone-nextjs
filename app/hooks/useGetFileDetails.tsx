import { imageKit } from "@/utils";

interface FileDetailsResponse {
  fileId: string;
  width: number;
  height: number;
  filePath: string;
  url: string;
  fileType: string;
  customMetadata?: {
    sensitive: boolean;
  };
}

const useGetFileDetails = async (fileId: string) => {
  const getFileDetails = (fileId: string): Promise<FileDetailsResponse> => {
    return new Promise((resolve, reject) => {
      imageKit.getFileDetails(fileId, function (err, res) {
        if (err) reject(err);
        if (res) resolve(res as FileDetailsResponse);
      });
    });
  };
  const postImageDetials: FileDetailsResponse = await getFileDetails(fileId);
  return {
    fileType: postImageDetials.fileType,
    width: postImageDetials.width,
    height: postImageDetials.height,
    sensitive: postImageDetials.customMetadata?.sensitive,
  };
};

export default useGetFileDetails;
