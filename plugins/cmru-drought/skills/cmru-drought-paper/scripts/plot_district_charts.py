import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os

def main():
    print("=== CMRU Drought Paper helper: District Chart Generator ===")
    
    # 1. Check arguments
    if len(sys.argv) < 2:
        print("Usage: python plot_district_charts.py <path_to_gee_district_stats.csv> [output_image_path.png]")
        sys.exit(1)
        
    csv_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else "buriram_drought_risk_chart.png"
    
    if not os.path.exists(csv_path):
        print(f"Error: File not found at {csv_path}")
        sys.exit(1)
        
    # 2. Read CSV Data
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        sys.exit(1)
        
    print(f"Successfully loaded data with {len(df)} rows.")
    
    # 3. Handle Column Names (standard GEE exports might have different capitalization)
    district_col = None
    risk_col = None
    
    # Search for district name column
    for col in df.columns:
        if col.lower() in ["adm2_name", "district", "name", "amphoe", "district_name"]:
            district_col = col
            break
            
    # Search for risk score column
    for col in df.columns:
        if col.lower() in ["drought_risk_score", "risk_score", "mean", "drought_score", "risk"]:
            risk_col = col
            break
            
    if not district_col:
        # Fallback to first object/string column
        string_cols = df.select_dtypes(include=['object']).columns
        if len(string_cols) > 0:
            district_col = string_cols[0]
            
    if not risk_col:
        # Fallback to first numeric column
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            risk_col = numeric_cols[0]
            
    if not district_col or not risk_col:
        print("Error: Could not identify district name or risk score columns in the CSV.")
        print(f"Available columns: {list(df.columns)}")
        sys.exit(1)
        
    print(f"Using Column for District: '{district_col}'")
    print(f"Using Column for Risk Score: '{risk_col}'")
    
    # 4. Sort and Clean Data
    df_sorted = df.dropna(subset=[district_col, risk_col]).sort_values(by=risk_col, ascending=False)
    
    # 5. Set up plotting style
    plt.figure(figsize=(12, 8))
    sns.set_theme(style="whitegrid")
    
    # Try using Thai-compatible fonts if possible (will fallback gracefully)
    plt.rcParams['font.family'] = 'sans-serif'
    
    # 6. Generate Plot
    palette = sns.color_palette("Reds_r", n_colors=len(df_sorted))
    ax = sns.barplot(
        x=risk_col, 
        y=district_col, 
        data=df_sorted, 
        palette=palette,
        hue=district_col,
        legend=False
    )
    
    # Customizing labels
    plt.title("Agricultural Drought Risk Score by District in Buriram Province (2024)", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel("Mean Drought Risk Score (Percentile-Based)", fontsize=12, labelpad=10)
    plt.ylabel("District (FAO GAUL Level 2)", fontsize=12, labelpad=10)
    
    # Add values on the bars
    for i, p in enumerate(ax.patches):
        width = p.get_width()
        ax.text(
            width + 0.005,
            p.get_y() + p.get_height() / 2,
            f"{width:.3f}",
            ha="left", 
            va="center",
            fontsize=10, 
            fontweight='semibold'
        )
        
    plt.tight_layout()
    
    # 7. Save and Show
    try:
        plt.savefig(output_path, dpi=300)
        print(f"Success! Beautiful bar chart saved successfully to '{output_path}'")
    except Exception as e:
        print(f"Error saving image file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
