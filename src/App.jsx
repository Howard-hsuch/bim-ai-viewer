import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { IfcLoader } from "@thatopen/components";

export default function App() {
  const containerRef = useRef(null); // 3D 渲染用的容器
  const componentsRef = useRef(null); // 全域共享 components
  const ifcLoaderRef = useRef(null); // 全域共享 ifcLoader

  useEffect(() => {
    if (!containerRef.current) return;

    const components = new OBC.Components();
    const worlds = components.get(OBC.Worlds);

    const world = worlds.create(
      OBC.SimpleScene,
      OBC.SimpleCamera,
      OBC.SimpleRenderer
    );

    world.scene = new OBC.SimpleScene(components);
    world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
    world.camera = new OBC.SimpleCamera(components);

    components.init();
    world.scene.setup();
    world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    // ✅ 儲存 components 和 loader 到 ref
    componentsRef.current = components;
    ifcLoaderRef.current = components.get(IfcLoader);

    // ✅ 設定 wasm 路徑（注意資料夾要對）
    ifcLoaderRef.current.settings.webIfc.wasm = { path: "/ifc-wasm/" };

    // 🟣 顯示紫色立方體（目前先註解掉）
    /*
    const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    world.scene.three.add(cube);
    */

    // ✅ 綁定拖曳事件
    const handleDrop = async (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (!file) return;
      await loadIfc(file);
    };

    const handleDragOver = (event) => event.preventDefault();

    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
      if (world.renderer?.dispose) world.renderer.dispose();
    };
  }, []);

  // ✅ 處理點選上傳的事件
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await loadIfc(file);
  };

  // ✅ 讀取 IFC 的邏輯
  const loadIfc = async (file) => {
    try {
      const url = URL.createObjectURL(file);
      await ifcLoaderRef.current?.load(url);
    } catch (error) {
      console.error("IFC 載入失敗：", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* 左邊：3D Viewer */}
      <div
        ref={containerRef}
        style={{
          flexBasis: "70%",
          minWidth: 0,
          backgroundColor: "#f0f0f0",
          position: "relative",
        }}
      >
        {/* ✅ 隱藏的上傳輸入框 */}
        <input
          type="file"
          accept=".ifc"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* ✅ 可見的上傳按鈕 */}
        <button
          onClick={handleButtonClick}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 10,
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          選擇 IFC 檔案
        </button>
      </div>

      {/* 右邊：AI 預留區 */}
      <div
        style={{
          flexBasis: "30%",
          borderLeft: "1px solid #ccc",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h2>AI 對話（尚未啟用）</h2>
        <p>這裡是 AI 回答介面的預留空間。</p>
      </div>
    </div>
  );
}
