import json
import os
import sys

def create_notebook(filename, cells):
    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.8.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=2, ensure_ascii=False)
    print(f"Created Notebook: {os.path.basename(filename)}")

def main():
    print("=== CMRU Drought Paper helper: Notebook Generator ===")
    
    # Target directory is current directory or directory passed in argv
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    # Define the 9 Jupyter Notebook files and their cell templates
    # 01. Setup Environment
    create_notebook(os.path.join(target_dir, "01_setup_environment.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 1: การติดตั้งและเตรียมพร้อมระบบสิ่งแวดล้อมบน Google Colab\n",
                "--- \n",
                "งานวิจัย: การประเมินความเสี่ยงภัยแล้งทางการเกษตรในจังหวัดบุรีรัมย์\n",
                "\n",
                "สมุดโน้ตเล่มนี้จะช่วยนำเข้าห้องสมุด (Libraries) ที่จำเป็นและตรวจสอบการเข้าใช้งานระบบ Google Earth Engine API"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# ติดตั้งโมดูลเสริมสำหรับการทำแผนภูมิแผนที่เชิงพื้นที่แบบ Interactive และประมวลผลข้อมูล\n",
                "!pip install earthengine-api geemap geopandas rasterio matplotlib seaborn pandas --quiet"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import ee\n",
                "import geemap\n",
                "import pandas as pd\n",
                "import numpy as np\n",
                "\n",
                "print(\"All libraries imported successfully!\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# ทำการยืนยันตัวตนเข้าระบบ Google Earth Engine\n",
                "ee.Authenticate()\n",
                "# ยืนยันสิทธิ์โปรเจกต์ (แทนที่ 'your-project-id' ด้วยชื่อโปรเจกต์ GEE ของท่าน)\n",
                "ee.Initialize(project='your-project-id')"
            ]
        }
    ])

    # 02. Study Area
    create_notebook(os.path.join(target_dir, "02_study_area.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 2: การโหลดพื้นที่ศึกษา (จังหวัดบุรีรัมย์และรายอำเภอ)\n",
                "--- \n",
                "โหลดขอบเขตพื้นที่เชิงฟังก์ชันจาก FAO GAUL 2015 ใน Google Earth Engine"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import ee\n",
                "import geemap\n",
                "ee.Initialize()"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# โหลดขอบเขตจังหวัดบุรีรัมย์ (ADM1)\n",
                "buriram = ee.FeatureCollection(\"FAO/GAUL/2015/level1\") \\\n",
                "    .filter(ee.Filter.eq(\"ADM1_NAME\", \"Buri Ram\"))\n",
                "\n",
                "# โหลดขอบเขตอำเภอรายอำเภอในบุรีรัมย์ (ADM2)\n",
                "buriram_districts = ee.FeatureCollection(\"FAO/GAUL/2015/level2\") \\\n",
                "    .filter(ee.Filter.eq(\"ADM1_NAME\", \"Buri Ram\"))\n",
                "\n",
                "print(f\"Loaded Buriram districts feature: Success!\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# แสดงผลแผนที่เชิงโต้ตอบ\n",
                "Map = geemap.Map()\n",
                "Map.centerObject(buriram, 9)\n",
                "Map.addLayer(buriram, {}, 'Buriram Province Layer')\n",
                "Map.addLayer(buriram_districts, {}, 'Buriram Districts Layer')\n",
                "Map"
            ]
        }
    ])

    # 03. Sentinel-2 Composite & Cloud Masking
    create_notebook(os.path.join(target_dir, "03_sentinel2_composite.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 3: การประมวลผลคัดกรองเมฆและยุบรวมข้อมูลดาวเทียม Sentinel-2\n",
                "--- \n",
                "สร้างชุดข้อมูลมัธยฐานไร้เมฆ (Median Composite Cloud-Free Image) ของฤดูแล้ง, ฤดูฝน และ Baseline 5 ปี"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import ee\n",
                "ee.Initialize()\n",
                "\n",
                "buriram = ee.FeatureCollection(\"FAO/GAUL/2015/level1\").filter(ee.Filter.eq(\"ADM1_NAME\", \"Buri Ram\"))"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# 1. ฟังก์ชันคัดกรองเมฆโดยใช้ค่า SCL (Scene Classification Layer)\n",
                "def mask_s2_clouds(image):\n",
                "    scl = image.select(\"SCL\")\n",
                "    mask = (\n",
                "        scl.neq(3)       # Shadow\n",
                "        .And(scl.neq(8)) # Medium Probability Cloud\n",
                "        .And(scl.neq(9)) # High Probability Cloud\n",
                "        .And(scl.neq(10))# Cirrus\n",
                "        .And(scl.neq(11))# Snow/Ice\n",
                "    )\n",
                "    return image.updateMask(mask).divide(10000).copyProperties(image, [\"system:time_start\"])"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# 2. ดึงภาพและยุบรวมค่ามัธยฐาน (Median Composite)\n",
                "s2 = ee.ImageCollection(\"COPERNICUS/S2_SR_HARMONIZED\") \\\n",
                "    .filterBounds(buriram) \\\n",
                "    .filter(ee.Filter.lt(\"CLOUDY_PIXEL_PERCENTAGE\", 30)) \\\n",
                "    .map(mask_s2_clouds)\n",
                "\n",
                "# ฤดูแล้ง ปี 2024\n",
                "dry_2024 = s2.filterDate(\"2024-01-01\", \"2024-04-30\").median().clip(buriram)\n",
                "# ฤดูฝน ปี 2024\n",
                "wet_2024 = s2.filterDate(\"2024-08-01\", \"2024-10-31\").median().clip(buriram)\n",
                "# Baseline ฤดูแล้ง 5 ปีย้อนหลัง (2019-2023)\n",
                "baseline_dry = s2.filter(ee.Filter.calendarRange(1, 4, \"month\")) \\\n",
                "    .filterDate(\"2019-01-01\", \"2023-04-30\") \\\n",
                "    .median().clip(buriram)\n",
                "\n",
                "print(\"Composites generated: Dry season, Wet season, and Baseline dry composites are ready.\")"
            ]
        }
    ])

    # 04. Spectral Indices
    create_notebook(os.path.join(target_dir, "04_spectral_indices.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 4: การคำนวณดัชนีเชิงสเปกตรัม (NDVI, NDMI, NDWI)\n",
                "--- \n",
                "สูตรดัชนีความอุดมสมบูรณ์พืชพรรณ ความชื้นของโครงสร้างใบ และการสร้างหน้ากากแหล่งน้ำผิวโลก"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# ฟังก์ชันคำนวณดัชนีทางแสง\n",
                "def calculate_indices(image):\n",
                "    ndvi = image.normalizedDifference([\"B8\", \"B4\"]).rename(\"NDVI\")\n",
                "    ndmi = image.normalizedDifference([\"B8\", \"B11\"]).rename(\"NDMI\")\n",
                "    ndwi = image.normalizedDifference([\"B3\", \"B8\"]).rename(\"NDWI\")\n",
                "    return image.addBands([ndvi, ndmi, ndwi])"
            ]
        }
    ])

    # 05. Drought Risk Analysis
    create_notebook(os.path.join(target_dir, "05_drought_risk.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 5: แบบจำลองความเสี่ยงภัยแล้ง (Drought Risk Score & Classification)\n",
                "--- \n",
                "ทำการ Normalize ดัชนีด้วยเทคนิค Percentile ในพื้นที่ศึกษา เพื่อหลีกเลี่ยงเกณฑ์ตายตัวสากล และแบ่งสัดส่วนความเสี่ยงสูง ปานกลาง ต่ำ"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# ร่างโค้ดคำนวณ Percentile-based Normalization\n",
                "# ดึงค่า P5 และ P95 ของข้อมูล NDVI และ NDMI ในพื้นที่ศึกษาเพื่อแปลงเป็น Risk Score"
            ]
        }
    ])

    # 06. Anomaly Analysis
    create_notebook(os.path.join(target_dir, "06_anomaly_analysis.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 6: การคำนวณค่าความผิดปกติเชิงสเปกตรัม (Anomaly Analysis)\n",
                "--- \n",
                "เปรียบเทียบดัชนีของฤดูแล้งปี 2024 กับค่าเฉลี่ยหลายปี 2019-2023 เพื่อพิสูจน์ความแตกต่างผิดธรรมชาติ"
            ]
        }
    ])

    # 07. CHIRPS Rainfall Support
    create_notebook(os.path.join(target_dir, "07_chirps_support.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 7: ข้อมูลฝนสนับสนุนจากดาวเทียม CHIRPS\n",
                "--- \n",
                "คำนวณปริมาณฝนสะสม และหาความสอดคล้องกับภัยแล้งทางการเกษตรระดับอำเภอ"
            ]
        }
    ])

    # 08. District Statistics & Visualizations
    create_notebook(os.path.join(target_dir, "08_district_statistics.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 8: การสรุปสถิติเฉลี่ยรายอำเภอและการทำ Zonal Statistics\n",
                "--- \n",
                "สร้างตารางค่าเฉลี่ยดัชนีภัยแล้งระดับอำเภอ (23 อำเภอของจังหวัดบุรีรัมย์) เพื่อใช้พล็อตกราฟ"
            ]
        }
    ])

    # 09. Export outputs
    create_notebook(os.path.join(target_dir, "09_export.ipynb"), [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# ขั้นตอนที่ 9: การส่งออกแผนที่ (GeoTIFF) และตาราง (CSV)\n",
                "--- \n",
                "บันทึกไฟล์ส่งออกไปที่ Google Drive เพื่อพร้อมนำผลสถิติและรูปภาพแผนที่ไปเขียนจัดหน้าลงบทความวิจัย"
            ]
        }
    ])

    print("Success! All 9 Jupyter Notebook template files created under target directory.")

if __name__ == "__main__":
    main()
