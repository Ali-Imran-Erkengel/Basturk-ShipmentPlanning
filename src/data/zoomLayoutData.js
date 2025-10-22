export const businessPartnersColumns = [
    {
        "DataField": "CardCode",
        "Caption": "Muhatap Kodu"
    },
    {
        "DataField": "CardName",
        "Caption": "Muhatap"
    },
    {
        "DataField": "FederalTaxID",
        "Caption": "TCKN/VKN"
    }

]
export const businessPartnersFilters = ["CardCode", "CardName", "FederalTaxID"];

export const itemsColumns = [
    {
        "DataField": "ItemCode",
        "Caption": "Kalem Kodu"
    },
    {
        "DataField": "ItemName",
        "Caption": "Kalem Açıklama"
    },
    {
        "DataField": "QuantityOnStock",
        "Caption": "Stok"
    },
    {
        "DataField": "ItemsGroupCode",
        "Caption": "Gurup Kodu"
    },
]

export const itemsFilters = ["ItemCode", "ItemName", "ItemsGroupCode"];

export const shipmentPlanningFilters = ["DocEntry", "Description"];
export const shipmentPlanningColumns = [
    {
        "DataField": "DocEntry",
        "Caption": "Sevkiyat No"
    },
    {
        "DataField": "U_Description",
        "Caption": "Açıklama"
    }
]
export const driverFilters = ["U_Name", "U_MiddleName", "U_Surname"];
export const driverColumns = [
    {
        "DataField": "U_Name",
        "Caption": "Adı"
    },
    {
        "DataField": "U_MiddleName",
        "Caption": "İkinci Adı"
    },
    {
        "DataField": "U_Surname",
        "Caption": "Soyadı"
    }
]
export const logisticsFilters = ["DocNum", "U_CustomDocNum", "U_Date", "U_Description", "U_OcrdNo", "U_DriverName", "U_PalletQuantity"];
export const logisticsColumns = [
    {
        "DataField": "DocNum",
        "Caption": "Belge No"
    },
    {
        "DataField": "U_CustomDocNum",
        "Caption": "Custom Belge No"
    },
    {
        "DataField": "U_Date",
        "Caption": "Teslim Tarihi"
    },
    {
        "DataField": "U_Description",
        "Caption": "Açıklama"
    },
    {
        "DataField": "U_OcrdNo",
        "Caption": "Tedarikçi"
    },
    {
        "DataField": "U_DriverName",
        "Caption": "Şöför"
    },
    {
        "DataField": "U_PalletQuantity",
        "Caption": "Palet Miktarı"
    }
]
export const employeeFilters = ["DocNum", "U_Description", "U_OcrdNo"];
export const employeeFiltersTerm = ["FirstName", "LastName"];
export const employeeColumns = [
    {
        "DataField": "FirstName",
        "Caption": "Adı"
    },
    {
        "DataField": "LastName",
        "Caption": "Soyadı"
    }
]
export const vehicleFilters = ["U_PlateCode", "U_TrailerPlateCode", "U_Name", "U_Surname", "U_VehicleType"];
export const vehicleColumns = [
    {
        "DataField": "U_PlateCode",
        "Caption": "Çekici Plaka"
    },
    {
        "DataField": "U_TrailerPlateCode",
        "Caption": "Dorse Plaka"
    },
    {
        "DataField": "U_Name",
        "Caption": "Şöför Adı"
    },
    {
        "DataField": "U_Surname",
        "Caption": "Şöför Soyadı"
    },
    {
        "DataField": "U_VehicleType",
        "Caption": "Araç Tipi"
    }
]

export const bankFilters = ["CountryCode", "BankCode", "BankName", "SwiftNo"];
export const bankColumns = [
    {
        "DataField": "CountryCode",
        "Caption": "Ülke/Bölge Kodu"
    },
    {
        "DataField": "BankCode",
        "Caption": "Banka Kodu"
    },
    {
        "DataField": "BankName",
        "Caption": "Banka Adı"
    },
    {
        "DataField": "SwiftNo",
        "Caption": "BIC/SWIFT kodu"
    }
]
export const trailerTypeFilters = ["U_Trailer"];
export const trailerTypeColumns = [
    {
        "DataField": "U_Trailer",
        "Caption": "Dorse"
    }

]

export const bankAccountsFilters = ["AccNo", "IBAN", "BankCode", "City", "Country"];
export const bankAccountsColumns = [
    {
        "DataField": "BankCode",
        "Caption": "Banka Kodu"
    },
    {
        "DataField": "AccNo",
        "Caption": "Hesap No"
    },
    {
        "DataField": "IBAN",
        "Caption": "IBAN"
    },
    {
        "DataField": "City",
        "Caption": "İl"
    },
    {
        "DataField": "Country",
        "Caption": "Ülke"
    }
]
export const industryFilters = ["IndustryCode", "IndustryName", "IndustryDescription"];
export const industryColumns = [
    {
        "DataField": "IndustryCode",
        "Caption": "Sektör Kodu"
    },
    {
        "DataField": "IndustryName",
        "Caption": "Sektör Adı"
    },
    {
        "DataField": "IndustryDescription",
        "Caption": "Sektör Açıklama"
    }

]
export const GLAccountFilters = ["Code", "Name", "Balance"];
export const GLAccountColumns = [
    {
        "DataField": "Code",
        "Caption": "Hesap Numarası"
    },
    {
        "DataField": "Name",
        "Caption": "Hesap Adı"
    },
    {
        "DataField": "Balance",
        "Caption": "Hesap Bakiyesi"
    }

]
export const poFilters = ["DocNum", "CardCode", "CardName"];
export const poColumns = [
    // {
    //     "DataField": "DocEntry",
    //     "Caption": "Belge ID"
    // },
    {
        "DataField": "DocNum",
        "Caption": "Belge No"
    },
    {
        "DataField": "CardCode",
        "Caption": "Tedarikçi Kodu"
    },
    {
        "DataField": "CardName",
        "Caption": "Tedarikçi"
    }
]
export const declarationFilters = ["DocNum", "U_DeclarationNo", "U_DeclarationDate", "U_CardCode", "U_CardName"]
export const declarationColumns = [
    {
        "DataField": "DocNum",
        "Caption": "Belge No"
    },
    {
        "DataField": "U_DeclarationNo",
        "Caption": "Beyanname Numarası"
    },
    {
        "DataField": "U_DeclarationDate",
        "Caption": "Beyanname Tarihi"
    },
    {
        "DataField": "U_CardCode",
        "Caption": "Muhatap Kodu"
    },
    {
        "DataField": "U_CardName",
        "Caption": "Muhatap Adı"
    }
]
export const binLocationFilters = ["AbsEntry", "BinCode", "Warehouse"];
export const binLocationColumns = [
    {
        "DataField": "AbsEntry",
        "Caption": "Depo Yeri Entry"
    },
    {
        "DataField": "BinCode",
        "Caption": "Depo Yeri Kodu"
    },
    {
        "DataField": "Warehouse",
        "Caption": "Depo"
    }
]
export const warehouseFilters = ["WarehouseCode", "WarehouseName"];
export const warehouseColumns = [
    {
        "DataField": "WarehouseCode",
        "Caption": "Depo Kodu"
    },
    {
        "DataField": "WarehouseName",
        "Caption": "Depo Adı"
    }
]
