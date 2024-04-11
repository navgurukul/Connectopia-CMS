import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ProductImageScan = () => {
  const [imageData, setImageData] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterImage, setFilterImage] = useState();
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(1);
  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");

  useEffect(() => {
    fetchAndFilterImages();
  }, []);


  async function fetchAndFilterImages() {
    const url = `http://15.206.198.172/cms/campaign/get-signed-url/${campaignId}/${scanType}`;
    try {
      const response = await fetch(url);
      console.log(response, "aiushdiuyasghd8iuas");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data, "meraaaaa")
      // const filteredImages = data["0"]
      const filteredImages = data.data
        .filter((image) => image.key.endsWith(".png"))
        .map((image) => image.value);
        console.log(filteredImages, "filteredImages")
      setFilterImage(filteredImages);
      console.log(filteredImages, "filteredImages");
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "image/png") {
        setFile(selectedFile);
        setUploadMessage("");
      } else {
        setUploadMessage("Please upload PNG format only.");
        setTimeout(() => setUploadMessage(""), 4000);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSave = async () => {
    if (!file) {
      alert("Please select a file before saving.");
      return;
    }
    setLoading(true);
    setSaving(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        `http://15.206.198.172/compile-upload/${campaignId}/0/${imageData}/${scanType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response.data === "Both .mind and image file got uploaded successfully"
      ) {
        setUploadMessage("Image  Uploaded Successfully !!");
        fetchAndFilterImages();
        setTimeout(() => setUploadMessage(""), 7000);
      } else {
        setUploadMessage("Image  Updated Successfully !!");
        fetchAndFilterImages();
        setTimeout(() => setUploadMessage(""), 7000);
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setSaving(false);
      setLoading(false);
      setImageData("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  useEffect(() => {
    console.log(imageData, "order", order);
  }, [imageData, order]);

  const options = [
    { value: "ImageScan1", order: 1 },
    { value: "ImageScan2", order: 2 },
    { value: "ImageScan3", order: 3 },
    { value: "ImageScan4", order: 4 },
    { value: "ImageScan5", order: 5 },
  ];
  const values = options.map((option) => option.value);
  const orders = options.map((option) => option.order);
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="shadowbox">
            <div className="shadowbox-head">
              <div className="row">
                <div className="col-1">
                  <div className="text-begin">
                    <ul className="list-inline"></ul>
                  </div>
                </div>
                <div className="col-10">
                  <h2 className="title text-center">
                    Generate Image to be Scan
                  </h2>
                  <hr />
                  {uploadMessage && (
                    <div
                      className="alert alert-success text-center"
                      style={{ marginTop: "-10px", marginBottom: "-10px" }}
                    >
                      {uploadMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col-6">
                <div
                  style={{
                    border: "1px dotted black",
                    padding: "20px",
                    width: "350px",
                    margin: "auto",
                  }}
                >
                  <div className="mb-2">
                    <h6>Select the images Level wise</h6>
                    <select
                      id="imagedata"
                      className="form-select"
                      value={imageData}
                      onChange={(e, index) => {
                        setImageData(e.target.value);
                       setOrder(e.target.selectedIndex + 1);
                      }}
                    >
                      {values.map((option, index) => (
                        <option key={index} value={option} >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e)}
                      disabled={!imageData}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "25px", marginLeft: "100px" }}
                    onClick={handleSave}
                  >
                    {saving ? "Training..." : "Save Image"}
                  </button>

                  {loading && (
                    <div style={{ marginTop: "15px" }}>
                      <div
                        className="loading-bar"
                        style={{ width: "100%" }}
                      ></div>
                      <p>
                        Please wait as the image is being trained, this might
                        take some time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-6">
                <div
                  style={{
                    border: "1px dotted black",
                    padding: "5px",
                    width: "500px",
                    marginLeft: "-50px",
                  }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center">Title</th>
                        <th className="text-center">Image Scanner </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(filterImage) &&
                        filterImage.map((imageUrl, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {imageUrl.split("/").pop().split(".")[0]}
                            </td>
                            <td className="text-center">
                              <a
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={imageUrl}
                                  alt={imageUrl.split("/").pop().split(".")[0]}
                                  style={{ width: "30px", height: "30px" }}
                                />
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductImageScan;
