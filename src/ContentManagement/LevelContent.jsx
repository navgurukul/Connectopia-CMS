import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./levelcontent.css";

export function LevelContent() {
  const [imageData, setImageData] = useState({});
  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");
  const [stageNumber, setStageNumber] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedStage, setSelectedStage] = useState("1");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const LevelData = [
    {
      name: "Level Map",
      description: "This indicates the user progress on a level map",
      formats: "GIF",
      order: 1,
    },
    {
      name: "Progress Bar",
      description: "This indicates the user progress on Stage",
      formats: "PNG, JPG, JPEG",
      order: 2,
    },
    {
      name: "Text Promt After Successful Scan",
      description:
        "This will pop up when the user successfully scans the image",
      formats: "PNG, JPG, JPEG",
      order: 3,
    },
    {
      name: "Level Completion Thought",
      description: "Character thought after successfully scans",
      formats: "PNG, JPG, JPEG",
      order: 4,
    },
    {
      name: "Level Completion Badge",
      description: "This icon/ image will appear in the stage progress bar",
      formats: "PNG, JPG, JPEG",
      order: 5,
    },
    {
      name: "Time Up Registration",
      description: "Registration on Level completed",
      formats: "PNG, JPG, JPEG",
      order: 6,
    },
    {
      name: "Reward Claim Badge",
      description: "This badge will be shown on the  counters to claim reward",
      formats: "PNG, JPG, JPEG",
      order: 7,
    },
  ];

  const handleStageClick = (number) => {
    setSelectedDiv(number);
    setSelectedStage(number); // Update selected stage
    setSelectedLevel(1); // Reset selected level to 1 when a new stage is clicked
    console.log("Selected Stage: ", number);
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://15.206.198.172/cms/campaign/stages/with-level/${campaignId}`
      );
      const data = await response.json();

      console.log("Data: ", data);
      setStageNumber(data?.stages?.total_stages);
      setImageData(data?.level);
    } catch (error) {
      console.error("An error occurred while fetching the data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId, scanType]);

  return (
    <div className="content-container">
      <div className="stage-contanier" style={{ display: "flex" }}>
        {Array.from({ length: stageNumber }, (_, index) => (
          <div
            key={index + 1}
            style={{
              color: "red",
              border: selectedDiv === index + 1 ? "2px solid blue" : "none",
              cursor: "pointer",
              marginRight: "10px",
              padding: "5px",
            }}
            onClick={() => handleStageClick(index + 1)}
          >
            Stage {index + 1}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h4>Levels</h4>
        <div>
          {Array.from({ length: 5 }, (_, level) => (
            <button
              key={level + 1}
              onClick={() => handleLevelClick(level + 1)}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                margin: "5px",
                backgroundColor: selectedLevel === level + 1 ? "green" : "gray",
              }}
            >
              {level + 1}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4>Selected Level: {selectedLevel}</h4>
        <table id="level-table">
          <thead>
            <tr id="table-head">
              <th>Name</th>
              <th>Description</th>
              <th>Formats</th>
            </tr>
          </thead>
          <tbody>
            {LevelData.map((level) => (
              <tr id="main-tr" key={level.order}>
                <td style={{ padding: "6px" }}>
                  <strong>{level.name}</strong>
                </td>
                <td>{level.description}</td>
                <td>{level.formats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
