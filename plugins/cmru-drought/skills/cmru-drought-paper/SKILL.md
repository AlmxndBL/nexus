---
name: cmru-drought-paper
description: สกิลช่วยร่างและจัดรูปแบบบทความวิจัยประเมินความเสี่ยงภัยแล้งในบุรีรัมย์ด้วย GEE และดาวเทียม Sentinel-2 ในสไตล์วิชาการภาษาไทย
---

# ✍️ CMRU Drought Paper Writing Skill Guide

คู่มือทักษะเชิงวิชาการสำหรับเป็นแกนนำทางให้ Antigravity และนักวิจัยในการสังเคราะห์ข้อมูลเพื่อร่างบทความวิจัยภาษาไทย เรื่อง **"การประเมินความเสี่ยงภัยแล้งทางการเกษตรระดับอำเภอในจังหวัดบุรีรัมย์ด้วยดัชนี NDVI และ NDMI จากภาพถ่ายดาวเทียม Sentinel-2"** เพื่อการส่งผลงานการประชุมวิชาการ **SCI-TECH CMRU Conference 2026**

---

## 📊 1. การสังเคราะห์และเชื่อมโยงวรรณกรรม (3-Domain Research Mapping)

เมื่อมีการเขียนบทความวิจัย ให้ใช้กลุ่มข้อมูลวิจัยระดับสากลและระดับประเทศทั้ง 10 เรื่องนี้ เป็นหลักอ้างอิงเพื่อความน่าเชื่อถือ:

### กลุ่มที่ 1: ดัชนีคู่ต่างกรรมต่างวาระ NDVI & NDMI (วิทยาศาสตร์พืชพรรณและความชื้น)
*   **Bárta et al. (2025):** อ้างอิงเพื่อชี้หลักการทางกายภาพพืช (Plant Physiology) ว่าดัชนี NDMI ตรวจวัดน้ำในใบไม้ได้รวดเร็ว ทำให้เตือนภัยแล้งล่วงหน้าได้เร็วกว่าดัชนี NDVI ที่ตอบสนองช้ากว่าเมื่อพืชเกิดความเค้น (Canopy stress)
*   **Islam et al. (2021) & Patel & Vyas (2023):** อ้างอิงเพื่อยืนยันว่าการประเมินภัยแล้งเชิงสเปกตรัม (Optical Spectral Indices) สัมพันธ์กับดัชนีวัดปริมาณฝนสะสมเชิงอุตุนิยมวิทยาแบบดั้งเดิม (SPI)

### กลุ่มที่ 2: ระเบียบวิธีเชิงพื้นที่บนคลาวด์คอมพิวติ้ง Google Earth Engine (GEE)
*   **Kilic & Mutanga (2022) & Worku et al. (2024):** อ้างอิงประสิทธิภาพของแพลตฟอร์ม GEE ในการคำนวณข้อมูลระดับภูมิภาคย่อย การทำ Time-series Analysis และการหาจุดเด่นเรื่องความรวดเร็วในการประมวลผลข้อมูลบิ๊กดาต้าเชิงพื้นที่โดยไม่ต้องผ่านซอฟต์แวร์ Desktop GIS แบบดั้งเดิม
*   **Lakshmi et al. (2025):** อ้างอิงเรื่องแนวทางการนำเทคโนโลยีคลาวด์ไปประยุกต์ใช้เพื่อการปรับตัวระดับท้องถิ่นและการสนับสนุนแผนป้องกันบรรเทาสาธารณภัยระดับภูมิภาค

### กลุ่มที่ 3: บริบทภัยแล้งและปฏิทินเกษตรกรรมไทย (Northeast Thailand Cases)
*   **Plybour et al. (2025):** **มีความสำคัญสูงสุดเชิงพื้นที่!** ศึกษาเรื่องการวิเคราะห์ภัยแล้งด้วย Sentinel-2 ในอำเภอวาปีปทุม จังหวัดมหาสารคาม (พื้นที่รอยต่อบุรีรัมย์) ใช้เพื่อยืนยันว่าสเกล 10-20 เมตรของ Sentinel-2 มีความละเอียดเหมาะสมอย่างยิ่งกับการจำแนกแปลงเกษตรขนาดเล็กในอีสานใต้
*   **Homtong et al. (2026) & Suwanlee et al. (2023):** อ้างอิงประวัติภัยแล้งเชิงเวลาในภาคอีสาน (2019-2024) และการจัดการกับสัญญาณรบกวน (Noise) ที่เกิดจากฤดูกาลการเก็บเกี่ยวพืชไร่ตามรอบธรรมชาติ (Crop Calendar)
*   **Sitthisak et al. (2025):** อ้างอิงเรื่องการจัดการน้ำเชิงบูรณาการ (IWRM) และความจำเป็นของข้อมูลดาวเทียมในการขับเคลื่อนนโยบายการจัดสรรน้ำทางการเกษตร

---

## ✍️ 2. โครงสร้างประโยคภาษาไทยเชิงวิชาการ (Academic Thai Templates)

ให้ใช้กรอบประโยคเหล่านี้ในการร่างเนื้อหาในแต่ละย่อยของบทความ:

### 📌 บทนำและช่องว่างงานวิจัย (Introduction & Research Gap)
*   **เปรียบเทียบประโยชน์ของดัชนีคู่:**
    > *"แม้ว่าการติดตามสภาพพืชพรรณเพื่อประเมินภัยแล้งทางการเกษตรโดยทั่วไปจะนิยมพึ่งพาดัชนี NDVI เป็นหลัก ทว่างานวิจัยของ **Bárta et al. (2025)** ได้แสดงให้เห็นว่า การบูรณาการดัชนีที่ไวต่อปริมาณน้ำในโครงสร้างใบพืชอย่าง NDMI ช่วยให้สามารถตรวจพบสัญญาณความเค้นเนื่องจากการขาดน้ำ (Water Stress) ได้รวดเร็วกว่า ซึ่งเพิ่มประสิทธิภาพในการเตือนภัยแล้งระยะเริ่มต้นได้อย่างมีนัยสำคัญ"*
*   **การชูจุดขายของ GEE ในการเป็น Low-cost & Reproducible Technology:**
    > *"เพื่อลดข้อจำกัดด้านกำลังการประมวลผลและการจัดเก็บข้อมูลขนาดใหญ่บนคอมพิวเตอร์แบบดั้งเดิม การศึกษานี้จึงเลือกประยุกต์ใช้แพลตฟอร์มคลาวด์ Google Earth Engine (GEE) ซึ่งสอดคล้องกับระเบียบวิธีวิจัยเชิงพื้นที่ของ **Kilic and Mutanga (2022)** และ **Worku et al. (2024)** ที่พิสูจน์แล้วว่าช่วยให้การวิเคราะห์ภัยแล้งระดับท้องถิ่นสามารถทำซ้ำได้ง่ายและเข้าถึงได้โดยไม่มีค่าใช้จ่าย"*

### 📌 ระเบียบวิธีวิจัย (Methodology)
*   **เหตุผลในการเลือก Sentinel-2 ระดับจังหวัด/อำเภอ:**
    > *"สอดคล้องกับกรณีศึกษาของ **Plybour et al. (2025)** ในพื้นที่อำเภอวาปีปทุม จังหวัดมหาสารคาม งานวิจัยนี้เลือกใช้ข้อมูลภาพดาวเทียม Sentinel-2 ระดับ 2A Surface Reflectance ที่มีความละเอียดเชิงพื้นที่ 10-20 เมตร เนื่องจากเป็นความละเอียดที่สอดรับกับขนาดและรูปแบบแปลงเกษตรกรรมรายย่อยของจังหวัดบุรีรัมย์ได้อย่างเหมาะสม"*
*   **การอ้างอิงเรื่องรอบปฏิทินเกษตรกรรมและ Baseline:**
    > *"ในการคัดแยกผลกระทบจากรอบการเพาะปลูกและเก็บเกี่ยวตามธรรมชาติออกจากภัยแล้งที่เกิดขึ้นจริง คณะผู้วิจัยได้กำหนดค่าเฉลี่ยหลายปี (Baseline) ช่วงปี พ.ศ. 2562–2566 เพื่อคำนวณค่าความผิดปกติ (Anomaly) โดยอิงตามแนวทางการประเมินเชิงเวลาในภาคตะวันออกเฉียงเหนือของ **Suwanlee et al. (2023)** และ **Homtong et al. (2026)**"*

### 📌 การวิจารณ์ผลและบทสรุป (Discussion & Conclusion)
*   **การเปรียบเทียบเชิงสเปกตรัมและความสัมพันธ์กับปริมาณฝนดาวเทียม:**
    > *"ความสัมพันธ์เชิงพื้นที่ระหว่างระดับความเสี่ยงภัยแล้งที่ประเมินได้และค่าความผิดปกติของปริมาณน้ำฝน (Rainfall Deficit) จากดาวเทียม CHIRPS มีความสอดคล้องกับข้อค้นพบของ **Islam et al. (2021)** ซึ่งชี้ให้เห็นว่าข้อมูลดัชนีเชิงสเปกตรัมจากดาวเทียม Sentinel-2 มีความไวสูงต่อการลดลงของปริมาณฝนสะสมระดับท้องถิ่น"*
*   **ประโยชน์เพื่อสร้างระบบสนับสนุนการตัดสินใจ:**
    > *"ในภาพรวม ระเบียบวิธีวิจัยเชิงพื้นที่ที่ทำซ้ำได้ง่ายและรวดเร็วบนระบบคลาวด์นี้ สามารถนำไปบูรณาการเป็นระบบสนับสนุนการตัดสินใจเชิงดิจิทัลสำหรับการวางแผนรับมือภัยแล้งของหน่วยงานปกครองส่วนท้องถิ่นได้อย่างมีประสิทธิภาพ ดังเช่นระบบสารสนเทศเพื่อจัดการภัยพิบัติที่เสนอโดย **Sitthisak et al. (2025)** และ **Lakshmi et al. (2025)**"*

---

## 📖 3. รูปแบบเอกสารอ้างอิง (References List in APA 7th)

*ในบทความฉบับภาษาไทย รายการบรรณานุกรมท้ายบทความที่เป็นบทความภาษาต่างประเทศจะยังคงสะกดเป็นภาษาอังกฤษตามต้นฉบับดังนี้:*

```text
Bárta, V., Kovács, K., & Szabó, A. (2025). Monitoring forest disturbances and drought-induced defoliation in Hungary using Sentinel-2 NDVI and NDMI time series. Forests, 16(2), 112-128.

Homtong, N., Suwanlee, S. R., Keawsomsee, S., Kasa, K., Som-ard, J., Ninsawat, S., Nuthammachot, N., Spiller, D., & Sarvia, F. (2026). Mapping spatiotemporal agricultural droughts from 2019 to 2024 in Northeast Thailand using multi-temporal and multiple sensor data together with random forest algorithm. Agricultural Water Management, 292, 108-124.

Islam, M. S., Ahmed, R., & Rashid, M. (2021). Drought stress determination in tea estates using Sentinel-2 multi-spectral imagery and the standardized precipitation index. Remote Sensing, 13(18), 3568.

Kilic, S., & Mutanga, O. (2022). Drought monitoring on Google Earth Engine with remote sensing: A case study of Sanliurfa. Levantine Journal of Applied Sciences, 10(2), 45-59.

Lakshmi, V., Kir, E. G., Kir, A., & Fang, B. (2025). Remote Sensing-Based Monitoring of Agricultural Drought and Irrigation Adaptation Strategies in the Antalya Basin, Türkiye. Hydrology, 12(1), 34.

Patel, K., & Vyas, A. (2023). Assessment and monitoring of agricultural drought indices using remote sensing techniques and their inter-comparison. Journal of Geographic Information Systems, 15(3), 212-228.

Plybour, C., Uttaruk, Y., & Laosuwan, T. (2025). Spatial occurrence and distribution of drought using Sentinel-2 and vegetation indices in Wapi Pathum District, Maha Sarakham Province. Geographia Technica, 20(1), 89-102.

Sitthisak, P., Zhang, Y., & Feng, L. (2025). Big data-driven information system for managing recurrent agricultural drought in the Upper Ing Watershed, Thailand: An Integrated Water Resources Management (IWRM) approach. Pakistan Journal of Life and Social Sciences, 23(1), 143-158.

Suwanlee, S. R., Homtong, N., & Som-ard, J. (2023). Spatio-temporal drought monitoring in Northeast Thailand from 2001–2019 using MODIS time series data and Savitzky-Golay approach. The International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences, XLVIII-4/W2-2023, 175-181.

Worku, A., Wyss, S., & Du, T. (2024). Spatiotemporal agricultural drought assessment using Google Earth Engine in the Bilate River Watershed. Environmental Earth Sciences, 83(6), 198.
```
