
import React from 'react'
import { Truck, ClipboardList, Layers, ArrowLeftRight, PackageOpen, RotateCcwIcon, WineOff, ScanBarcode, ArchiveRestore } from "lucide-react";
import { useScreenSize } from '../../utils/media-query';
import { useNavigate } from 'react-router-dom';


function SelectScreen() {
    const navigate = useNavigate();
    const { isXSmall } = useScreenSize();
    const pages = [
        { name: "Transfer", icon:ArrowLeftRight , path: "/inventoryTransfer", color: "#3f76db" },
        { name: "Teslimat", icon: Truck, path: "/delivery", color: "#28a745" },
        { name: "İade", icon: RotateCcwIcon, path: "/returns", color: "#dc3545" },
        { name: "Kırık", icon: WineOff, path: "/barcodedProcess", color: "#6f42c1", code: "BRK" },
        { name: "Emr Ayr", icon: Layers, path: "/barcodedProcess", color: "#20c997", code: "EMR" },
        { name: "Repack", icon: PackageOpen, path: "/barcodedProcess", color: "#fd7e14", code: "REP" },
        { name: "Nakil Talebinden Transfer", icon: ClipboardList, path: "/transferFromRequest", color: "#17a2b8" },
        { name: "Parti Ayrıntıları", icon: ScanBarcode, path: "/batchDetails", color: "#c71893" },
        { name: "Hattan Transfer", icon: ArchiveRestore, path: "/transfer", color: "#c79818" }
    ];
    const containerStyle = {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
        flexDirection: isXSmall ? "column" : "row"
    };
    const cardStyle = {
        flex: isXSmall ? "1 1 100%" : "1 1 200px",
        minHeight: "120px",
        cursor: "pointer",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
    };
    const iconStyle = { marginBottom: "8px" };
    const titleStyle = { fontWeight: 600, textAlign: "center" ,fontSize: "24px"};
    return (
        <div style={containerStyle}>
            {pages.map(page => {
                const Icon = page.icon;
                return (
                    <div
                        key={page.name}
                        style={{
                            ...cardStyle,
                            backgroundColor: page.color + "33"
                        }}
                        onClick={() => {
                            navigate(page.path, { state: { processType: page.code || null } });
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = `0 4px 16px ${page.color}66`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        }}
                    >
                        <Icon size={32} style={{ ...iconStyle, color: page.color }} />
                        <div style={titleStyle}>{page.name}</div>
                    </div>
                );
            })}
        </div>
    )
}

export default SelectScreen