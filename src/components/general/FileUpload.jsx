import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const FileUpload = ({ onFileSelect, clearPreview }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    onFileSelect(selectedFile); // Pass the file to the parent component

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    if (clearPreview) {
      setPreview(null);
    }
  }, [clearPreview]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {preview && (
        <div>
          <h2>File Preview:</h2>
          <img
            src={preview}
            alt="File preview"
            style={{ maxWidth: "100%", maxHeight: 300 }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
