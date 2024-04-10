import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./levelcontent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faPen,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

export function LevelContent() {
  const [data, setData] = useState();
  const [imageData, setImageData] = useState({});
  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");
  const [stageNumber, setStageNumber] = useState([]);
  const [selectedStage, setSelectedStage] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [levelArr, setLevelArr] = useState([]);
  const [stageId, setStageId] = useState(null);
  const fileInputRef = useRef(null);
  const levelStartIndexes = [20, 40, 60, 80, 100];
  const gifInputRef = useRef(null);
  let formData = new FormData();
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
      name: "Text Prompt After Successful Scan",
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
      description: "This badge will be shown on the counters to claim reward",
      formats: "PNG, JPG, JPEG",
      order: 7,
    },
  ];
  const fileInputRefs = LevelData.map(() => React.createRef());
  //console.log("File Input Refs: ", fileInputRefs);

  const handleStageClick = (number) => {
    setSelectedStage(number);
    setSelectedLevel(1);
    let stageName = "stage-" + number;

    data && setStageId(data[stageName]?.stage_id);
    // console.log("data[stageName]?.stage_id", data[stageName]?.stage_id);
  };

  const handleFileChange = (
    event,
    index,
    isImageAvailable,
    selectedStage,
    selectedLevel,
    order,
    stageId,
    level
  ) => {
    // //console.log(
    //   "Upload Icon Clicked",
    //   isImageAvailable,
    //   selectedStage,
    //   selectedLevel,
    //   order,
    //   stageId
    // );
    const file = event.target.files[0];
    let key = file?.name.replace(/\s/g, "").slice(0, -4);

    //console.log("Key: ", key);

    const formData = new FormData();
    formData.append("image", file);
    // console.log(stageId, "This is the stage ID that is being passed");
    const url = `http://15.206.198.172/cms/campaign/upload-image/${campaignId}/${selectedLevel}/${order}/level?stage_id=${stageId}&key=${key}`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Success:", data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const handleUploadIconClick = (
    isImageAvailable,
    selectedStage,
    selectedLevel,
    order,
    stageId,
    level
  ) => {
    //console.log(
    //   "Upload Icon Clicked",
    //   isImageAvailable,
    //   selectedStage,
    //   selectedLevel,
    //   order,
    //   stageId
    // );
    const index = order - 1;
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = "";
      fileInputRefs[index].current.click();
    }
  };

  const fetchData = async () => {
    let stageName = "stage-" + selectedStage;
    let levelName = "level-" + selectedLevel;
    try {
      const response = await fetch(
        `http://15.206.198.172/cms/campaign/stages/with-level/${campaignId}`
      );
      const data = await response.json();
      setData(data.data);
      // console.log("Data: ", data.data);
      setStageNumber(data?.data?.total_stages);
     if(stageId===null) setStageId(data?.data["stage-1"].stage_id);
      if (data.data[stageName]) {
        // console.log("Data at line 180: ", data.data[stageName][levelName]);
        setLevelArr(data.data[stageName][levelName]);
      }
      ////console.log("Stage ID number: ", data?.stages["stage-1"].stage_id);
    } catch (error) {
      console.error("An error occurred while fetching the data: ", error);
    }
  };

  useEffect(() => {
    //console.log(stageId);
  });

  useEffect(() => {
    let stageName = "stage-" + selectedStage;
    let levelName = "level-" + selectedLevel;
    if (data) {
      // console.log("Data at line 180: ", data);
      setLevelArr(data[stageName][levelName]);
    }
  }, [levelArr, data, selectedLevel, selectedStage]);

  function uploadImg() {}

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
              border: selectedStage === index + 1 ? "2px solid blue" : "none",
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {LevelData.map((level, index) => {
              let isImageAvailable = levelArr && levelArr[index + 1]?.image;
              //   let isImageAvailable;
              //   const filteredData = levelArr?.filter((obj) => obj.order === 6);

              //   if (filteredData?.length > 0) {
              //     // If there are objects remaining, access the image of the first object
              //     isImageAvailable = filteredData[0]?.image;

              // }
              //   console.log(isImageAvailable);
              // console.log(levelArr);

              return (
                <tr id="main-tr" key={level.order}>
                  <td style={{ padding: "6px" }}>
                    <strong>{level.name}</strong>
                  </td>
                  <td>{level.description}</td>
                  <td
                    onClick={() => {
                      //console.log("Formats Clicked");
                    }}
                  >
                    {level.formats}
                  </td>
                  <td>
                    {isImageAvailable && (
                      <FontAwesomeIcon
                        className="icon-styles"
                        icon={faDownload}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {
                      <FontAwesomeIcon
                        className="icon-styles"
                        icon={!isImageAvailable ? faUpload : faPen}
                        onClick={(event) => {
                          handleUploadIconClick(
                            isImageAvailable,
                            selectedStage,
                            selectedLevel,
                            level.order,
                            stageId,
                            level
                          );
                        }}
                        style={{
                          cursor: "pointer",
                          color: isImageAvailable ? "green" : null,
                        }}
                      />
                    }
                    {isImageAvailable && (
                      <FontAwesomeIcon
                        className="icon-styles"
                        icon={faEye}
                        style={{ cursor: "pointer" }}
                      />
                    )}

                    <input
                      type="file"
                      ref={fileInputRefs[index]}
                      style={{ display: "none" }}
                      onChange={(event) =>
                        handleFileChange(
                          event,
                          index,
                          isImageAvailable,
                          selectedStage,
                          selectedLevel,
                          level.order,
                          stageId,
                          level
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
