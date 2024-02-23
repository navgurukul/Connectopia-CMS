import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import '../App.css';
import { GeneralContent } from "./GeneralContent";
import { LevelContent } from "./LevelContent";
import { ProductScanContent } from "./ProductScanContent";
import ProductImageScan from "./ProductImageScan";
import './ContentManagement.css';

export function ContentManagement() {
  const [content, setContent] = useState(<GeneralContent />);
  const [activeButton, setActiveButton] = useState("general");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const campaignId = localStorage.getItem('CampaignId');
  const scanType = localStorage.getItem('ScanType');

  useEffect(() => {

    const cleanUp = () => {
      localStorage.removeItem('TempCampaignId');
      localStorage.removeItem('TempCampaigName');
    };
    return cleanUp;
  }, []);

  const handleButtonClick = (newContent, buttonName) => {
    setContent(newContent);
    setActiveButton(buttonName);
  };

  const isButtonActive = (buttonName) => {
    return activeButton === buttonName ? 'selected-button' : '';
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`https://skillmuni.in:8080/withoutStatus/allsignedurls/${campaignId}/${scanType}`);
      const data = await response.json();

      if (data["0"]) {
        const imageUrl = data["0"][0].value;
        setQrCodeUrl(imageUrl);
      }
    } catch (error) {
      console.error("An error occurred while fetching the data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadQrCode = async () => {
    try {
      const imageFetch = await fetch(qrCodeUrl);
      const imageBlob = await imageFetch.blob();
      const objectUrl = URL.createObjectURL(imageBlob);

      const tempLink = document.createElement('a');
      tempLink.href = objectUrl;

      tempLink.download = 'Main-QRCode.png';

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {

      console.error("An error occurred while downloading the image:", error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex">
        <div className="col-6 ">
          <div className="row">
            <div className="col-md-4 text-center">
              <button
                className={`create-button-but ${isButtonActive('general')}`}
                onClick={() => handleButtonClick(<GeneralContent />, 'general')}>
                General Content
              </button>
            </div>
            <div className="col-md-4 text-start">
              <button
                className={`create-button-but ${isButtonActive('level')}`}
                onClick={() => handleButtonClick(<LevelContent />, 'level')}>
                Level Content
              </button>
            </div>
            <div className="col-md-4 text-start">
              <button
                className={`create-button-but ${isButtonActive('productscan')}`}
                onClick={() =>
                  scanType === 'QRscan' ?
                    handleButtonClick(<ProductScanContent />, 'productscan') :
                    handleButtonClick(<ProductImageScan />, 'productscan')
                }
              >
                Product image/QR
              </button>
            </div>
          </div>
        </div>
        <div className="col-6 text-end">
          <button className="btn custom-download-btn" onClick={downloadQrCode}>
            <strong>Download QR code:</strong> <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>

      <div className="flex-fill" style={{ flex: "9", marginTop: "17px" }}>
        {content}
      </div>
    </div>
  );
}
