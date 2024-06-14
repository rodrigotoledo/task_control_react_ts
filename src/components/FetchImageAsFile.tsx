import axios from '../axiosConfig';
const FetchImageAsFile = async (imageUrl: string): Promise<File | null> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch image');
    }

    const fileExtension = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
    const blob = new Blob([response.data], { type: mimeType });
    const randomFileName = `image-${Date.now()}.${fileExtension}`;

    const file = new File([blob], randomFileName, { type: mimeType });

    return file;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

export default FetchImageAsFile;