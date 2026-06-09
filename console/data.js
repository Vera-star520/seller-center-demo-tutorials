/* ============================================================
   Shared sample data for the Seller Console sandbox.
   Fictional demo merchant — no real customer information.
   ============================================================ */
(function () {
  const STORE = { name: "FBABEE Demo Site", country: "United States" };

  // ship-from addresses
  const ADDRESSES = [
    {
      id: "werner", company: "FBABEE", name: "FBABEE",
      street: "Bld, #2 Haoyuntong Park Science and Technology Park",
      city: "Dongguan", district: "Tangxia", state: "Guangdong",
      zip: "523710", country: "China", phone: "+86 769 8100 0920", isDefault: true,
      oneLine: "FBABEE, Bld, #2 Haoyuntong Park Science and Technology Park, Dongguan, Guangdong, 523710, CN",
    },
    {
      id: "fbabee", company: "FBABEE", name: "FBABEE Warehouse",
      street: "xixiang street", city: "Shenzhen", district: "Bao'an", state: "Guangdong",
      zip: "518000", country: "China", phone: "+86 755 2100 0920", isDefault: false,
      oneLine: "FBABEE, xixiang street, Shenzhen, Guangdong, 518000, CN",
    },
  ];

  // FBABEE-branded demo SKUs (apparel & accessories) — all identifiers fictional.
  // age buckets = units by days in storage: [0-60, 61-90, 91-180, 181-330, 331-365, 366-455, 456+]
  const P = [
    {
      sku: "FBABEE-TEE-BLK-001", asin: "B0FBEE1001", fnsku: "X00FBEE101", upc: "810000000017",
      name: "FBABEE Classic Logo Tee — Unisex Short-Sleeve Cotton T-Shirt, Soft Ringspun Jersey, Tagless Comfort Collar (Midnight Black)",
      shortName: "FBABEE Classic Logo Tee — Black",
      supplier: "FBABEE Brand", storage: "Standard", awd: true, awdNote: "Eligible",
      sellThrough: "1.42", sellDelta: "+0.012",
      sales: "$18,420.50", salesUnits: "612 units",
      fee: "Exempted", dos: "61.4",
      inbound: 220, onhand: 184, reserved: 6, researching: 2, unfulfillable: 3,
      recommended: "150 | 40", health: "Healthy", excess: 0,
      age: [560, 18, 0, 0, 0, 0, 0],
      unitsPerBox: 30, boxDims: [16, 12, 10], boxWeight: 16, recQty: 60,
    },
    {
      sku: "FBABEE-CAP-KHK-001", asin: "B0FBEE1002", fnsku: "X00FBEE102", upc: "810000000024",
      name: "FBABEE Embroidered Dad Hat — Adjustable Cotton Twill Baseball Cap with Bee Logo, Curved Brim, Brass Buckle Strap (Khaki)",
      shortName: "FBABEE Embroidered Dad Hat — Khaki",
      supplier: "FBABEE Brand", storage: "Standard", awd: true, awdNote: "Auto-replenishment",
      sellThrough: "1.08", sellDelta: "+0.004",
      sales: "$9,260.00", salesUnits: "463 units",
      fee: "Exempted", dos: "74.2",
      inbound: 60, onhand: 220, reserved: 9, researching: 1, unfulfillable: 2,
      recommended: "90 | 24", health: "Healthy", excess: 0,
      age: [254, 30, 12, 0, 0, 0, 0],
      unitsPerBox: 40, boxDims: [14, 12, 10], boxWeight: 12, recQty: 40,
    },
    {
      sku: "FBABEE-HOOD-GRY-001", asin: "B0FBEE1003", fnsku: "X00FBEE103", upc: "810000000031",
      name: "FBABEE Pullover Hoodie — Midweight Fleece-Lined Sweatshirt, Kangaroo Pocket, Drawstring Hood, Embroidered Wordmark (Heather Grey)",
      shortName: "FBABEE Pullover Hoodie — Heather Grey",
      supplier: "FBABEE Brand", storage: "Standard", awd: true, awdNote: "Auto-replenishment",
      sellThrough: "1.96", sellDelta: "+0.051",
      sales: "$31,540.75", salesUnits: "402 units",
      fee: "No fees this week", dos: "21.8",
      inbound: 12, onhand: 18, reserved: 7, researching: 1, unfulfillable: 4,
      recommended: "180 | 35", health: "Low stock", excess: 0,
      age: [36, 6, 0, 0, 0, 0, 0],
      unitsPerBox: 20, boxDims: [18, 14, 12], boxWeight: 20, recQty: 160,
    },
    {
      sku: "FBABEE-TOTE-NAT-001", asin: "B0FBEE1004", fnsku: "X00FBEE104", upc: "810000000048",
      name: "FBABEE Canvas Tote Bag — Heavyweight 12oz Reusable Cotton Shopping Tote with Reinforced Handles and Bee Print (Natural)",
      shortName: "FBABEE Canvas Tote Bag — Natural",
      supplier: "FBABEE Brand", storage: "Standard", awd: false, awdNote: "",
      sellThrough: "0.92", sellDelta: "-0.006",
      sales: "$6,815.40", salesUnits: "318 units",
      fee: "Exempted", dos: "88.6",
      inbound: 0, onhand: 142, reserved: 4, researching: 0, unfulfillable: 1,
      recommended: "70 | 21", health: "Healthy", excess: 0,
      age: [96, 24, 22, 0, 0, 0, 0],
      unitsPerBox: 50, boxDims: [15, 12, 9], boxWeight: 14, recQty: 50,
    },
    {
      sku: "FBABEE-BNE-NVY-001", asin: "B0FBEE1005", fnsku: "X00FBEE105", upc: "810000000055",
      name: "FBABEE Ribbed Knit Beanie — Cuffed Soft Acrylic Winter Hat, One Size, Woven Bee Label (Navy)",
      shortName: "FBABEE Ribbed Knit Beanie — Navy",
      supplier: "FBABEE Brand", storage: "Standard", awd: false, awdNote: "",
      sellThrough: "0.35", sellDelta: "-0.004",
      sales: "$4,120.10", salesUnits: "137 units",
      fee: "Exempted", dos: "260.4",
      inbound: 0, onhand: 198, reserved: 3, researching: 0, unfulfillable: 2,
      recommended: "30 | 18", health: "Excess", excess: 56,
      age: [10, 8, 60, 120, 0, 0, 0],
      unitsPerBox: 60, boxDims: [13, 10, 8], boxWeight: 10, recQty: 30,
    },
  ];

  // Step 2 placement options
  const PLACEMENTS = [
    {
      id: "optimized", name: "Amazon-optimized", lowest: true,
      desc: "5 shipments: DEN8 (12 boxes, Aurora, CO), DFW6 (12 boxes, Coppell, TX), ILG1 (8 boxes, New Castle, DE), OAK3 (4 boxes, Patterson, CA), LIT2 (4 boxes, North Little Rock, AR)",
      window: "Starting Jul 12 – Jul 18, 2026", total: "$360.81", placement: "$0.00", shipping: "$360.81",
    },
    {
      id: "partial", name: "Partial Splits  (Any Region)", lowest: false,
      desc: "3 shipments: ILG1 (16 boxes, New Castle, DE), OAK3 (12 boxes, Patterson, CA), DEN8 (12 boxes, Aurora, CO)",
      window: "Jul 12 – Jul 18, 2026", total: "$381.59", placement: "$63.00", shipping: "$318.59",
    },
    {
      id: "minimal", name: "Minimal Splits  (Any Region)", lowest: false,
      desc: "1 shipment: SCK8 (40 boxes, Oakley, CA)",
      window: "Jul 12 – Jul 18, 2026", total: "$466.34", placement: "$266.40", shipping: "$199.94",
    },
  ];

  // Step 2-4 shipment breakdown (for the 2 selected SKUs, optimized into 5 FCs)
  const SHIPMENTS = [
    { n: 1, fc: "DEN8", id: "FBA15ABC12345", ref: "FBABEE01", addr: "21000 E 13th Ave. 80018 — Aurora, CO — United States", boxes: 12, skus: 2, units: 12 },
    { n: 2, fc: "DFW6", id: "FBA16DEF67890", ref: "—", addr: "940 W Bethel Road 75019-4424 — Coppell, TX — United States", boxes: 12, skus: 2, units: 12 },
    { n: 3, fc: "ILG1", id: "FBA17GHI24680", ref: "—", addr: "780 S. DuPont Highway 19720-4610 — New Castle, DE — United States", boxes: 8, skus: 2, units: 8 },
    { n: 4, fc: "OAK3", id: "FBA18JKL13579", ref: "—", addr: "255 Park Center Drive 95363-8876 — Patterson, CA — United States", boxes: 4, skus: 2, units: 4 },
    { n: 5, fc: "LIT2", id: "FBA19MNO86420", ref: "—", addr: "13001 Highway 70 72117-5026 — North Little Rock, AR — United States", boxes: 4, skus: 2, units: 4 },
  ];

  const SHIPMENTS_BY_PLACEMENT = {
    optimized: SHIPMENTS,
    partial: [
      { ...SHIPMENTS[2], n: 1, boxes: 16, units: 16, ref: "FBABEE01" },
      { ...SHIPMENTS[3], n: 2, boxes: 12, units: 12 },
      { ...SHIPMENTS[0], n: 3, boxes: 12, units: 12 },
    ],
    minimal: [
      { n: 1, fc: "SCK8", id: "FBA20PQR97531", ref: "FBABEE01", addr: "Oakley, CA — United States", boxes: 40, skus: 2, units: 40 },
    ],
  };

  window.DATA = { STORE, ADDRESSES, PRODUCTS: P, PLACEMENTS, SHIPMENTS, SHIPMENTS_BY_PLACEMENT };
})();
