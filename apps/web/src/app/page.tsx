"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Bike,
  Star,
  ThumbsUp,
  RefreshCw,
  DollarSign,
  Percent,
  Printer,
  MoreHorizontal,
  Wrench,
  Search,
  Plus,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  Phone,
  Clock,
  CheckCircle,
  CreditCard,
  X,
  FileText,
  MapPin,
  TrendingUp,
  Tag,
  Briefcase,
  Menu,
  Sliders,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  Info,
  Package,
  Trash2,
  FileSpreadsheet,
  Gauge,
  Users,
  Lock,
  Eye,
  Pencil
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Complaint {
  text: string;
  finding: string;
  action: string;
}

interface SpareItem {
  name: string;
  qty: number;
  price: number;
  mrp: number;
  hsn: string;
  code: string;
  status: string;
}

interface ServiceItem {
  name: string;
  rate: number;
  hsn: string;
  code: string;
  status: string;
}

interface TimelineItem {
  time: string;
  title: string;
  desc: string;
}

interface JobCard {
  id: string;
  vehicleNo: string;
  brandModel: string;
  customerName: string;
  phone: string;
  kms: number;
  completion: number;
  status: string;
  advisor: string;
  technician: string;
  urgency: string;
  estimate: number;
  paid: number;
  due: number;
  serviceType: string;
  date: string;
  complaints: Complaint[];
  spares: SpareItem[];
  services: ServiceItem[];
  timeline: TimelineItem[];
  isEstimated?: boolean;
  isStatusFilled?: boolean;
  overallDiscount?: number;
  advancePaid?: number;
}

interface InventoryBatch {
  batchNo: string;
  qty: number;
  purchasePrice: number;
  expiryDate: string;
  receivedDate: string;
}

interface InventoryTransaction {
  id: string;
  type: "purchase" | "issue" | "return" | "transfer";
  qty: number;
  date: string;
  reference: string;
  details: string;
}

interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  mrp: number;
  stockQty: number;
  minStockLevel: number;
  hsnCode: string;
  category: string;
  supplier: string;
  batches: InventoryBatch[];
  transactions: InventoryTransaction[];
}
interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
  settlementRatio: number;
  activeClaims: number;
  contactEmail: string;
  logoColor: string;
}

interface VehicleInsurancePolicy {
  id: string;
  customerName: string;
  vehicleNo: string;
  providerId: string;
  policyNo: string;
  expiryDate: string;
  premiumAmount: number;
  daysLeft: number;
}

interface InsuranceClaim {
  id: string;
  jobCardId: string;
  customerName: string;
  vehicleNo: string;
  providerId: string;
  claimNo: string;
  surveyorName: string;
  totalClaimed: number;
  surveyorApprovedSpares: number;
  surveyorApprovedLabor: number;
  status: "Under Review" | "Surveyor Appointed" | "Approved" | "Disbursed" | "Rejected";
  notes: string;
  dateInitiated: string;
}

interface Employee {
  id: string;
  workshopId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contact: string;
  designation: string;
  pwdExpiry: string;
  mobileAuth: boolean;
  dob?: string;
  anniversary?: string;
  address?: string;
}

interface UserRole {
  employeeId: string;
  roleName: string;
}

interface UserPermission {
  id: string;
  employeeId: string;
  roleCode: string;
  widgetType: "Button" | "Menu" | "Page" | "Tab";
  widgetName?: string;
  menuHeader?: string;
  menuOption?: string;
  menuLink?: string;
  permissions: string;
}

// Mock Data for Initial Job Cards
const INITIAL_JOBS = [
  {
    id: "JC-BBR-2026-00123",
    vehicleNo: "OD-05-AB-1234",
    brandModel: "Honda Activa 6G",
    customerName: "Aditya Pradhan",
    phone: "+91 98765 43210",
    kms: 12450,
    completion: 75,
    status: "Under Servicing",
    advisor: "Subhashis Sen",
    technician: "Manoj Kumar",
    urgency: "High",
    estimate: 1450,
    isEstimated: true,
    paid: 0,
    due: 1450,
    serviceType: "Regular",
    date: "29 May 2026",
    complaints: [
      { text: "Engine making heavy noise on acceleration", finding: "Loose timing chain and worn out tensioner guide", action: "repair_now" },
      { text: "Rear brake lever extremely loose", finding: "Brake shoe worn down to limit", action: "repair_now" }
    ],
    spares: [
      { name: "Front Brake Shoe Assembly", qty: 1, price: 350, mrp: 380, hsn: "HSN-8708", code: "SP-BRK-09", status: "issued" },
      { name: "Engine Oil 10W30 (800ml)", qty: 1, price: 450, mrp: 480, hsn: "HSN-2710", code: "SP-OIL-12", status: "issued" }
    ],
    services: [
      { name: "General Service Standard Charge", rate: 650, hsn: "SAC-9987", code: "SRV-GEN-01", status: "completed" }
    ],
    timeline: [
      { time: "09:30 AM", title: "Job Card Created", desc: "Vehicle checked in by Advisor Subhashis Sen" },
      { time: "10:15 AM", title: "Inspection Completed", desc: "101-Point inspection completed by Manoj Kumar" },
      { time: "11:00 AM", title: "Estimation Approved", desc: "Customer approved estimate via WhatsApp link" },
      { time: "01:30 PM", title: "Servicing In-Progress", desc: "Timing chain replacement under progress" }
    ]
  },
  {
    id: "JC-BBR-2026-00124",
    vehicleNo: "OD-02-XY-9876",
    brandModel: "TVS Jupiter 125",
    customerName: "Priya Sharma",
    phone: "+91 87654 32109",
    kms: 8900,
    completion: 100,
    status: "Ready for Delivery",
    advisor: "Anil Dash",
    technician: "Ramesh Naik",
    urgency: "Medium",
    estimate: 850,
    isEstimated: true,
    paid: 850,
    due: 0,
    serviceType: "Express",
    date: "29 May 2026",
    complaints: [
      { text: "General routine service", finding: "Engine oil dirty, air filter moderately dirty", action: "repair_now" },
      { text: "Spark plug gap adjustment", finding: "Spark plug electrode carbonized", action: "repair_now" }
    ],
    spares: [
      { name: "Engine Oil Premium 10W30", qty: 1, price: 450, mrp: 480, hsn: "HSN-2710", code: "SP-OIL-12", status: "issued" }
    ],
    services: [
      { name: "Express Washing & Polishing Bundle", rate: 400, hsn: "SAC-9987", code: "SRV-WSH-02", status: "completed" }
    ],
    timeline: [
      { time: "10:00 AM", title: "Job Card Created", desc: "Express service requested" },
      { time: "10:30 AM", title: "Routine Servicing Done", desc: "Engine oil replaced & air filter cleaned" },
      { time: "11:15 AM", title: "Washing Completed", desc: "Double foam wash and tire polish done" },
      { time: "11:45 AM", title: "Ready for Delivery", desc: "Quality inspection passed by Supervisor" }
    ]
  },
  {
    id: "JC-BBR-2026-00125",
    vehicleNo: "OD-33-CD-5678",
    brandModel: "Bajaj Pulsar 150",
    customerName: "Devendra Mishra",
    phone: "+91 76543 21098",
    kms: 22100,
    completion: 40,
    status: "Under Servicing",
    advisor: "Subhashis Sen",
    technician: "Sanjay Rout",
    urgency: "Low",
    estimate: 5400,
    isEstimated: true,
    paid: 2000,
    due: 3400,
    serviceType: "Insurance Claim",
    date: "28 May 2026",
    complaints: [
      { text: "Front fender assembly broken", finding: "Broken due to external impact", action: "repair_now" },
      { text: "Fork bending causing handle alignment error", finding: "Left and right front fork tubes bent", action: "repair_now" }
    ],
    spares: [
      { name: "Bajaj Pulsar Front Fender (Black)", qty: 1, price: 1200, mrp: 1250, hsn: "HSN-8708", code: "SP-FND-43", status: "issued" },
      { name: "Front Fork Pipe Set", qty: 1, price: 2800, mrp: 3000, hsn: "HSN-8708", code: "SP-FRK-12", status: "estimated" }
    ],
    services: [
      { name: "Fork Alignment and Straightening", rate: 600, hsn: "SAC-9987", code: "SRV-FRK-01", status: "estimated" },
      { name: "Accidental Body Fitting Labor", rate: 800, hsn: "SAC-9987", code: "SRV-LAB-04", status: "estimated" }
    ],
    timeline: [
      { time: "Yesterday", title: "Job Card Created", desc: "Insurance Claim process initiated" },
      { time: "Yesterday", title: "Surveyor Inspection Done", desc: "ICICI Lombard surveyor approved fender & fork pipes replacement" },
      { time: "Today", title: "Work Commenced", desc: "Fork pipes dismantling by Sanjay Rout" }
    ]
  },
  {
    id: "JC-BBR-2026-00126",
    vehicleNo: "OD-05-PQ-4321",
    brandModel: "KTM Duke 200",
    customerName: "Rohan Das",
    phone: "+91 99334 55667",
    kms: 18400,
    completion: 90,
    status: "Payment Processing",
    advisor: "Anil Dash",
    technician: "Manoj Kumar",
    urgency: "High",
    estimate: 2800,
    isEstimated: true,
    paid: 1000,
    due: 1800,
    serviceType: "Accidental",
    date: "29 May 2026",
    complaints: [
      { text: "Clutch slipping on higher revs", finding: "Clutch plates completely burnt out", action: "repair_now" },
      { text: "Right side rear indicator broken", finding: "Lens cracked, filament burned", action: "repair_now" }
    ],
    spares: [
      { name: "KTM Duke 200 Clutch Plate Kit", qty: 1, price: 1800, mrp: 1950, hsn: "HSN-8708", code: "SP-CLT-22", status: "issued" },
      { name: "Rear LED Turn Indicator", qty: 1, price: 450, mrp: 480, hsn: "HSN-8512", code: "SP-IND-04", status: "issued" }
    ],
    services: [
      { name: "Clutch Housing Overhaul Labor", rate: 550, hsn: "SAC-9987", code: "SRV-LAB-02", status: "completed" }
    ],
    timeline: [
      { time: "08:45 AM", title: "Check-in Done", desc: "Vehicle towed in due to clutch failure" },
      { time: "09:30 AM", title: "Dismantling Done", desc: "Engine oil drained, clutch cover opened" },
      { time: "11:00 AM", title: "Replacement Finished", desc: "New clutch plates and clutch cover gasket fitted" },
      { time: "01:00 PM", title: "Invoiced", desc: "Tax Invoice generated by Cashier" }
    ]
  }
];

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobCard[]>(INITIAL_JOBS);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Read theme from localStorage on initial client mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Synchronize documentElement class list safely
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState("All Jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [jobRatings, setJobRatings] = useState<Record<string, number>>({});

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string; name: string; username: string; role: string; garageCode: string; token: string;
  } | null>({ id: "u1", name: "Aditya Pradhan", username: "admin", role: "super_admin", garageCode: "BBR-001", token: "bypass" });

  // Restore session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bikemaster_session");
      if (saved) {
        try {
          const session = JSON.parse(saved);
          setCurrentUser(session);
          setIsLoggedIn(true);
        } catch {
          localStorage.removeItem("bikemaster_session");
        }
      }
    }
  }, []);

  // Expandable Sidebar accordions states
  const [isReportsExpanded, setIsReportsExpanded] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isWorkshopExpanded, setIsWorkshopExpanded] = useState(false);

  // Business Reports State Variables
  const [reportStartDate, setReportStartDate] = useState("2026-05-01");
  const [reportEndDate, setReportEndDate] = useState("2026-05-31");
  const [reportLocation, setReportLocation] = useState("Bhubaneswar");
  const [gstSearchQuery, setGstSearchQuery] = useState("");
  const [insuranceClaimFilter, setInsuranceClaimFilter] = useState("Yes");
  const [insuranceStatusFilter, setInsuranceStatusFilter] = useState("Both");
  const [insuranceProviderFilter, setInsuranceProviderFilter] = useState("All");
  const [insuranceInvoiceFilter, setInsuranceInvoiceFilter] = useState("All");
  const [sparesFromLoc, setSparesFromLoc] = useState("DAMANA");
  const [sparesToLoc, setSparesToLoc] = useState("RAGHUNATHPUR");
  const [reportInvoiceType, setReportInvoiceType] = useState("By Services");

  // System Configuration CRUD States
  const [brandwiseConsumables, setBrandwiseConsumables] = useState([
    { id: "c1", brand: "BOSCH", name: "Engine Oil 10W30", code: "OIL-10W30" },
    { id: "c2", brand: "NIKAVI", name: "Chain Clean Spray", code: "LUBE-CH" },
    { id: "c3", brand: "HP", name: "Coolant Green", code: "CLNT-GRN" },
  ]);
  const [consumableBrandsList, setConsumableBrandsList] = useState([
    { id: "cb1", name: "HP" },
    { id: "cb2", name: "HITECH" },
    { id: "cb3", name: "MCLARINE" },
    { id: "cb4", name: "BOSCH" },
  ]);
  const [customerSourcesList, setCustomerSourcesList] = useState([
    { id: "cs1", company: "ANTIDOTE", gstin: "21AAMCS8857L1ZO", email: "info@antidote.co.in", contact: "9876543210", person: "A. Pradhan", address: "Raghunathpur", city: "Bhubaneswar", state: "Odisha", sms: "Yes", date: "2026-01-10" },
    { id: "cs2", company: "RUBRIC PROJECT PRIVATE LIMITED", gstin: "21ABBCS1234F1ZO", email: "contact@rubric.com", contact: "9937122334", person: "S. Sen", address: "Damana", city: "Bhubaneswar", state: "Odisha", sms: "Yes", date: "2026-03-15" },
  ]);
  const [insuranceProvidersList, setInsuranceProvidersList] = useState([
    { id: "ip1", name: "SBI GENERAL INSURANCE CO. LTD.", gstin: "21AAMCS8857L1ZO", address: "Bhubaneswar", contact: "9999999999", email: "support@sbigeneral.in" },
    { id: "ip2", name: "HDFC General Insurance", gstin: "GSTIN123456", address: "Bhubaneswar", contact: "0123456789", email: "claims@hdfcergo.com" },
  ]);
  const [sparesMasterList, setSparesMasterList] = useState([
    { id: "sm1", name: "Brake Shoe Front", code: "Spares" },
    { id: "sm2", name: "Accelerator Cable", code: "Spares" },
    { id: "sm3", name: "Engine Oil 1L", code: "Consumables" },
  ]);
  const [vehicleCategoriesList, setVehicleCategoriesList] = useState([
    { id: "vc1", name: "BIKE" },
    { id: "vc2", name: "SCOOTY" },
    { id: "vc3", name: "SCOOTER" },
  ]);
  const [vehicleModelsList, setVehicleModelsList] = useState([
    { id: "vm1", brand: "Suzuki", model: "Access", variant: "SCOOTY" },
    { id: "vm2", brand: "HERO", model: "KARIZMA", variant: "BIKE" },
    { id: "vm3", brand: "HARLEY DAVIDSON", model: "X440", variant: "BIKE" },
  ]);
  const [workshopBranches, setWorkshopBranches] = useState([
    { id: "4", name: "Bike Masters", address: "Raghunathpur", location: "RAGHUNATHPUR", pin: "751024", city: "Bhubaneswar", state: "Odisha", person: "Anil Dash", contact: "9876543210", email: "raghunathpur@bikemasters.com", tin: "TIN9988", company: "Bike Masters Pvt Ltd", cin: "CIN8877", serviceTax: "STAX8899" },
    { id: "3", name: "Bike Masters", address: "Damana", location: "DAMANA", pin: "751016", city: "Bhubaneswar", state: "Odisha", person: "Subhashis Sen", contact: "9937123456", email: "damana@bikemasters.com", tin: "TIN9989", company: "Bike Masters Pvt Ltd", cin: "CIN8878", serviceTax: "STAX8900" },
  ]);
  const [auditLogsList, setAuditLogsList] = useState([
    { id: "LOG-001", desc: "Vehicle Marked Done for OD-02-AX-1122", type: "Marked Done", category: "Vehicle Service", user: "Manoj Kumar", date: "2026-05-29 09:12:45" },
    { id: "LOG-002", desc: "Estimation updated for OD-33-Y-9988", type: "Estimation", category: "Vehicle Service", user: "Anil Dash", date: "2026-05-29 09:20:11" },
  ]);
  const [inventoryStockSummary, setInventoryStockSummary] = useState([
    { id: "is1", spareName: "Front Brake Shoe Assembly", brand: "Honda", model: "Activa H-Smart", variant: "SCOOTY", partBrand: "BOSCH", partNo: "BP-HON-098", totalQty: 100, consumedQty: 25, availableQty: 75, estimatedQty: 5, location: "Bin A-12" },
    { id: "is2", spareName: "Engine Oil 10W30 1L", brand: "TVS", model: "Apache", variant: "BIKE", partBrand: "HP", partNo: "OIL-HP-10W30", totalQty: 50, consumedQty: 12, availableQty: 38, estimatedQty: 2, location: "Oil Rack 3" },
  ]);
  const [packagesList, setPackagesList] = useState([
    { id: "pkg1", refId: "PKG-PMS-01", name: "PMS | ENGINE OIL AND COOLANT TOPUP AND WASH POLISH", type: "Other Services", price: 846.61, coverage: "PREMIUM SERVICE PACKAGE", user: "Aditya Pradhan", date: "2026-04-12" },
    { id: "pkg2", refId: "PKG-GEN-02", name: "PMS | GENERAL CHECKUP & ADJUSTMENT", type: "Regular Service", price: 299.00, coverage: "BASIC CHECKUP PACKAGE", user: "Anil Dash", date: "2026-04-18" },
  ]);
  const [servicesList, setServicesList] = useState([
    { id: "s1", name: "CARBURETOR CLEAN", category: "scooty", code: "Mechanical Services", amount: 249 },
    { id: "s2", name: "REAR WHEEL RIM PAINT", category: "scooty", code: "Dent and Paint", amount: 300 },
    { id: "s3", name: "SILENCER PAINT", category: "bike", code: "Dent and Paint", amount: 249 },
    { id: "s4", name: "POLISH", category: "bike", code: "Cleaning Services", amount: 149 },
  ]);

  // Load invoices from Backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/invoices`);
        if (res.ok) {
          const data = await res.json();
          setInvoices(data);
        }
      } catch (err) {
        console.error("Failed to fetch invoices", err);
      }
    };
    fetchInvoices();
  }, [activeTab]);

  // Load Inventory Stock Summary from Backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/spare-parts/stock-summary`);
        if (res.ok) {
          const data = await res.json();
          setInventoryStockSummary(data);
        }
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      }
    };
    if (activeTab === "Inventory Management") {
      fetchInventory();
    }
  }, [activeTab]);

  // Load Services Master from Backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services-master`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.category || "General",
            code: s.code,
            amount: s.rate
          }));
          setServicesList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    if (activeTab === "Manage Services") {
      fetchServices();
    }
  }, [activeTab]);

  const [deletedRecordsList, setDeletedRecordsList] = useState([
    { id: "del1", date: "2026-05-28", vehicle: "TVS Apache 160", name: "Debasis Jena", plateNo: "OD-02-X-4422", mobile: "9853312345", invoice: "INV-2026-009", discount: 150, due: 0, supervisor: "Anil Dash", tech: "Manoj Kumar", kms: 12500, source: "Walk-in" },
    { id: "del2", date: "2026-05-27", vehicle: "Suzuki Access 125", name: "Mamata Sahu", plateNo: "OD-33-A-1100", mobile: "9438123456", invoice: "INV-2026-007", discount: 0, due: 350, supervisor: "Subhashis Sen", tech: "Ramesh Naik", kms: 8900, source: "Referral" },
  ]);
  const [techProductivityList, setTechProductivityList] = useState([
    { id: "tp1", jobId: "JOB-9981", vehicle: "OD-02-AX-1122", name: "Manoj Kumar", service: "CARBURETOR CLEAN", status: "Marked Done", start: "09:00 AM", stop: "09:45 AM", duration: "45 mins", speed: "45 mins", cost: 100, profit: 149 },
    { id: "tp2", jobId: "JOB-9982", vehicle: "OD-33-Y-9988", name: "Ramesh Naik", service: "SILENCER PAINT", status: "Marked Done", start: "10:15 AM", stop: "11:30 AM", duration: "75 mins", speed: "65 mins", cost: 150, profit: 99 },
  ]);

  // Form states for general CRUD modals
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [crudModalMode, setCrudModalMode] = useState<"new" | "edit" | "view">("new");
  const [crudSelectedId, setCrudSelectedId] = useState<string | null>(null);
  const [crudForm, setCrudForm] = useState<any>({});
  const [crudFormSearchQuery, setCrudFormSearchQuery] = useState("");
  const [expandedGstRowId, setExpandedGstRowId] = useState<string | null>(null);
  const [showReportsSummary, setShowReportsSummary] = useState(true);
  const [inventoryThresholdMode, setInventoryThresholdMode] = useState(false);

  // Inventory State Variables
  const [inventoryList, setInventoryList] = useState<SparePart[]>([
    {
      id: "p1",
      name: "Front Brake Shoe Assembly",
      partNumber: "BP-HON-098",
      price: 350,
      mrp: 380,
      stockQty: 45,
      minStockLevel: 20,
      hsnCode: "HSN-8708",
      category: "Brakes",
      supplier: "Lucas TVS",
      batches: [
        { batchNo: "BAT-BRK-001", qty: 30, purchasePrice: 280, expiryDate: "N/A", receivedDate: "12 May 2026" },
        { batchNo: "BAT-BRK-002", qty: 15, purchasePrice: 290, expiryDate: "N/A", receivedDate: "20 May 2026" }
      ],
      transactions: [
        { id: "T101", type: "purchase", qty: 50, date: "12 May 2026", reference: "PO-9081", details: "Purchased from Lucas Distributor" },
        { id: "T102", type: "issue", qty: 5, date: "25 May 2026", reference: "JC-009", details: "Issued to Active ticket OD-05-AB-1234" }
      ]
    },
    {
      id: "p2",
      name: "Engine Oil Premium 10W30",
      partNumber: "SP-OIL-12",
      price: 450,
      mrp: 480,
      stockQty: 8,
      minStockLevel: 15,
      hsnCode: "HSN-2710",
      category: "Fluids",
      supplier: "Castrol India",
      batches: [
        { batchNo: "BAT-OIL-99", qty: 8, purchasePrice: 380, expiryDate: "10 Dec 2028", receivedDate: "15 Apr 2026" }
      ],
      transactions: [
        { id: "T201", type: "purchase", qty: 40, date: "15 Apr 2026", reference: "PO-8991", details: "Purchased from Castrol Depot" },
        { id: "T202", type: "issue", qty: 32, date: "22 May 2026", reference: "Multiple Tickets", details: "Regular servicing oil replacements" }
      ]
    },
    {
      id: "p3",
      name: "Spark Plug Champion Premium",
      partNumber: "SPK-PLG-01",
      price: 120,
      mrp: 140,
      stockQty: 3,
      minStockLevel: 10,
      hsnCode: "HSN-8511",
      category: "Electricals",
      supplier: "Bosch Auto",
      batches: [
        { batchNo: "BAT-SPK-04", qty: 3, purchasePrice: 90, expiryDate: "N/A", receivedDate: "10 Feb 2026" }
      ],
      transactions: [
        { id: "T301", type: "purchase", qty: 20, date: "10 Feb 2026", reference: "PO-7712", details: "Standard intake replenishment" },
        { id: "T302", type: "issue", qty: 17, date: "24 May 2026", reference: "Multiple Tickets", details: "Wear and tear changes" }
      ]
    },
    {
      id: "p4",
      name: "Front Fork Pipe Set Assembly",
      partNumber: "SP-FRK-12",
      price: 2800,
      mrp: 3000,
      stockQty: 12,
      minStockLevel: 5,
      hsnCode: "HSN-8708",
      category: "Suspension",
      supplier: "Endurance Systems",
      batches: [
        { batchNo: "BAT-FRK-11", qty: 12, purchasePrice: 2200, expiryDate: "N/A", receivedDate: "05 May 2026" }
      ],
      transactions: [
        { id: "T401", type: "purchase", qty: 15, date: "05 May 2026", reference: "PO-9901", details: "Restock heavy suspension units" },
        { id: "T402", type: "issue", qty: 3, date: "22 May 2026", reference: "JC-012", details: "Accidental shock replacement repair" }
      ]
    }
  ]);

  const [selectedPartId, setSelectedPartId] = useState<string>("p1");
  const [inventorySearchQuery, setInventorySearchQuery] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState<"all" | "low" | "out">("all");
  const [inventoryTabMode, setInventoryTabMode] = useState<"batches" | "transactions" | "transfer">("batches");

  // New Batch Form State
  const [newBatchForm, setNewBatchForm] = useState({ batchNo: "", qty: "", purchasePrice: "", expiry: "N/A" });
  // Transfer Form State
  const [transferForm, setTransferForm] = useState({ targetGarage: "Cuttack Hub", qty: "" });
  // Add Part Form state
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [addPartForm, setAddPartForm] = useState({ name: "", partNo: "", price: "", mrp: "", minStock: "", hsn: "HSN-8708", category: "General", supplier: "" });

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchForm.batchNo || !newBatchForm.qty || !newBatchForm.purchasePrice) {
      triggerToast("Please fill in all batch details", "warn");
      return;
    }
    const qtyNum = parseInt(newBatchForm.qty);
    const priceNum = parseFloat(newBatchForm.purchasePrice);
    if (isNaN(qtyNum) || qtyNum <= 0 || isNaN(priceNum) || priceNum <= 0) {
      triggerToast("Invalid quantity or price", "warn");
      return;
    }

    setInventoryList(prev => prev.map(part => {
      if (part.id === selectedPartId) {
        const updatedBatches = [...part.batches, {
          batchNo: newBatchForm.batchNo,
          qty: qtyNum,
          purchasePrice: priceNum,
          expiryDate: newBatchForm.expiry || "N/A",
          receivedDate: "29 May 2026"
        }];
        const updatedTransactions = [{
          id: `T${Date.now().toString().slice(-4)}`,
          type: "purchase" as const,
          qty: qtyNum,
          date: "29 May 2026",
          reference: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
          details: `Purchased batch ${newBatchForm.batchNo}`
        }, ...part.transactions];
        return {
          ...part,
          stockQty: part.stockQty + qtyNum,
          batches: updatedBatches,
          transactions: updatedTransactions
        };
      }
      return part;
    }));

    setNewBatchForm({ batchNo: "", qty: "", purchasePrice: "", expiry: "N/A" });
    triggerToast("Stock batch received and added to inventory!", "success");
  };

  const handleTransferStock = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(transferForm.qty);
    const activePart = inventoryList.find(p => p.id === selectedPartId);
    if (!activePart) return;

    if (!transferForm.qty) {
      triggerToast("Please enter transfer quantity", "warn");
      return;
    }
    if (isNaN(qtyNum) || qtyNum <= 0) {
      triggerToast("Invalid transfer quantity", "warn");
      return;
    }
    if (qtyNum > activePart.stockQty) {
      triggerToast(`Insufficient stock! Only ${activePart.stockQty} items available`, "warn");
      return;
    }

    setInventoryList(prev => prev.map(part => {
      if (part.id === selectedPartId) {
        let remainingToDeduct = qtyNum;
        const updatedBatches = part.batches.map(batch => {
          if (remainingToDeduct <= 0) return batch;
          const deduct = Math.min(batch.qty, remainingToDeduct);
          remainingToDeduct -= deduct;
          return { ...batch, qty: batch.qty - deduct };
        }).filter(b => b.qty > 0);

        const updatedTransactions = [{
          id: `T${Date.now().toString().slice(-4)}`,
          type: "transfer" as const,
          qty: qtyNum,
          date: "29 May 2026",
          reference: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
          details: `Dispatched ${qtyNum} units to ${transferForm.targetGarage}`
        }, ...part.transactions];

        return {
          ...part,
          stockQty: part.stockQty - qtyNum,
          batches: updatedBatches,
          transactions: updatedTransactions
        };
      }
      return part;
    }));

    setTransferForm({ targetGarage: "Cuttack Hub", qty: "" });
    triggerToast(`Dispatched ${qtyNum} units to ${transferForm.targetGarage} successfully!`, "success");
  };

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPartForm.name || !addPartForm.partNo || !addPartForm.price || !addPartForm.mrp) {
      triggerToast("Please fill in all core part details", "warn");
      return;
    }

    const priceNum = parseFloat(addPartForm.price);
    const mrpNum = parseFloat(addPartForm.mrp);
    const minStockNum = parseInt(addPartForm.minStock) || 5;

    if (isNaN(priceNum) || isNaN(mrpNum)) {
      triggerToast("Price and MRP must be numeric", "warn");
      return;
    }

    const newPart: SparePart = {
      id: `p${Date.now()}`,
      name: addPartForm.name,
      partNumber: addPartForm.partNo,
      price: priceNum,
      mrp: mrpNum,
      stockQty: 0,
      minStockLevel: minStockNum,
      hsnCode: addPartForm.hsn,
      category: addPartForm.category,
      supplier: addPartForm.supplier || "Direct Sourced",
      batches: [],
      transactions: [
        { id: `T${Date.now().toString().slice(-4)}`, type: "purchase", qty: 0, date: "29 May 2026", reference: "Init", details: "Part registered in Master Catalog" }
      ]
    };

    setInventoryList(prev => [...prev, newPart]);
    setSelectedPartId(newPart.id);
    setAddPartForm({ name: "", partNo: "", price: "", mrp: "", minStock: "", hsn: "HSN-8708", category: "General", supplier: "" });
    setIsAddPartModalOpen(false);
    triggerToast(`Part ${newPart.name} registered in master catalogue!`, "success");
  };

  // Insurance State Definitions
  const [insuranceProviders, setInsuranceProviders] = useState<InsuranceProvider[]>([
    { id: "prov-1", name: "ICICI Lombard General", code: "ICICI-LOM", settlementRatio: 94.2, activeClaims: 3, contactEmail: "claims@icicilombard.com", logoColor: "text-orange-500 bg-orange-500/10" },
    { id: "prov-2", name: "HDFC Ergo General", code: "HDFC-ERG", settlementRatio: 96.8, activeClaims: 5, contactEmail: "surveyors@hdfcergo.com", logoColor: "text-blue-500 bg-blue-500/10" },
    { id: "prov-3", name: "Bajaj Allianz General", code: "BAJAJ-ALZ", settlementRatio: 92.5, activeClaims: 2, contactEmail: "claims@bajajallianz.co.in", logoColor: "text-green-500 bg-green-500/10" },
    { id: "prov-4", name: "Tata AIG Insurance", code: "TATA-AIG", settlementRatio: 95.1, activeClaims: 4, contactEmail: "tata.aig@tata-aig.com", logoColor: "text-indigo-500 bg-indigo-500/10" }
  ]);

  const [insurancePolicies, setInsurancePolicies] = useState<VehicleInsurancePolicy[]>([
    { id: "pol-1", customerName: "Rohan Sen", vehicleNo: "OR-02-AT-9081", providerId: "prov-1", policyNo: "POL-88201", expiryDate: "2026-06-05", premiumAmount: 1850, daysLeft: 7 },
    { id: "pol-2", customerName: "Devendra Mishra", vehicleNo: "OD-33-AA-1209", providerId: "prov-2", policyNo: "POL-99212", expiryDate: "2026-06-12", premiumAmount: 2400, daysLeft: 14 },
    { id: "pol-3", customerName: "Sneha Mohanty", vehicleNo: "OD-02-XY-8877", providerId: "prov-4", policyNo: "POL-11029", expiryDate: "2026-06-24", premiumAmount: 1200, daysLeft: 26 }
  ]);

  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([
    { id: "clm-1", jobCardId: "JC-BBR-2026-00125", customerName: "Aditya Pradhan", vehicleNo: "OD-02-BH-4592", providerId: "prov-2", claimNo: "CLM-99801", surveyorName: "Manoj Das", totalClaimed: 14500, surveyorApprovedSpares: 8500, surveyorApprovedLabor: 4000, status: "Surveyor Appointed", notes: "Surveyor requested parts invoice copy & old parts photograph.", dateInitiated: "28 May 2026" },
    { id: "clm-2", jobCardId: "JC-BBR-2026-00123", customerName: "Priya Sharma", vehicleNo: "OD-02-CK-1122", providerId: "prov-1", claimNo: "CLM-90218", surveyorName: "Ramesh Naik", totalClaimed: 8200, surveyorApprovedSpares: 6200, surveyorApprovedLabor: 1500, status: "Approved", notes: "Depreciation of 10% applied on plastic body fittings.", dateInitiated: "29 May 2026" }
  ]);

  const [selectedClaimId, setSelectedClaimId] = useState<string>("clm-1");
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [isInitiateClaimModalOpen, setIsInitiateClaimModalOpen] = useState(false);
  const [claimSearchQuery, setClaimSearchQuery] = useState("");

  const [providerForm, setProviderForm] = useState({ name: "", code: "", email: "", ratio: "" });
  const [claimForm, setClaimForm] = useState({ jobCardId: "", providerId: "", surveyorName: "", claimedVal: "", notes: "" });

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerForm.name || !providerForm.code || !providerForm.email) {
      triggerToast("Please fill in all provider details", "warn");
      return;
    }
    const ratioNum = parseFloat(providerForm.ratio) || 90.0;
    const newProvider: InsuranceProvider = {
      id: `prov-${Date.now()}`,
      name: providerForm.name,
      code: providerForm.code.toUpperCase(),
      settlementRatio: ratioNum,
      activeClaims: 0,
      contactEmail: providerForm.email,
      logoColor: "text-slate-500 bg-slate-500/10"
    };
    setInsuranceProviders(prev => [...prev, newProvider]);
    setProviderForm({ name: "", code: "", email: "", ratio: "" });
    setIsAddProviderModalOpen(false);
    triggerToast(`Insurance provider ${newProvider.name} registered!`, "success");
  };

  const handleInitiateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.jobCardId || !claimForm.providerId || !claimForm.surveyorName) {
      triggerToast("Please fill in all core claim details", "warn");
      return;
    }
    const targetJob = jobs.find(j => j.id === claimForm.jobCardId) || INITIAL_JOBS.find(j => j.id === claimForm.jobCardId);
    const claimedValNum = parseFloat(claimForm.claimedVal) || (targetJob ? targetJob.estimate : 5000);
    const newClaim: InsuranceClaim = {
      id: `clm-${Date.now()}`,
      jobCardId: claimForm.jobCardId,
      customerName: targetJob ? targetJob.customerName : "Walk-in Customer",
      vehicleNo: targetJob ? targetJob.vehicleNo : "OD-02-TEMP",
      providerId: claimForm.providerId,
      claimNo: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      surveyorName: claimForm.surveyorName,
      totalClaimed: claimedValNum,
      surveyorApprovedSpares: 0,
      surveyorApprovedLabor: 0,
      status: "Under Review",
      notes: claimForm.notes || "New claim file initiated.",
      dateInitiated: "29 May 2026"
    };

    setInsuranceClaims(prev => [newClaim, ...prev]);
    setSelectedClaimId(newClaim.id);
    setClaimForm({ jobCardId: "", providerId: "", surveyorName: "", claimedVal: "", notes: "" });
    setIsInitiateClaimModalOpen(false);
    
    setInsuranceProviders(prev => prev.map(p => {
      if (p.id === claimForm.providerId) {
        return { ...p, activeClaims: p.activeClaims + 1 };
      }
      return p;
    }));

    triggerToast(`Claim ${newClaim.claimNo} submitted successfully!`, "success");
  };

  const handleUpdateClaimStatus = (id: string, status: "Under Review" | "Surveyor Appointed" | "Approved" | "Disbursed" | "Rejected") => {
    setInsuranceClaims(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status };
      }
      return c;
    }));
    triggerToast(`Claim status updated to ${status}!`, "success");
  };

  const handleUpdateClaimSplits = (id: string, approvedSpares: number, approvedLabor: number, surveyorNotes: string) => {
    setInsuranceClaims(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, surveyorApprovedSpares: approvedSpares, surveyorApprovedLabor: approvedLabor, notes: surveyorNotes };
      }
      return c;
    }));
    triggerToast("Surveyor approved claims splits updated successfully!", "success");
  };

  // Manage Users - Designation state
  const [designations, setDesignations] = useState<string[]>([
    "Supervisor", "Technician", "Service Engineer", "Store keeper", "Manager", "DATA ENTRY OPERATOR", "Accountant"
  ]);
  const [selectedDesignation, setSelectedDesignation] = useState<string>("Supervisor");
  const [isNewDesignationOpen, setIsNewDesignationOpen] = useState(false);
  const [isEditDesignationOpen, setIsEditDesignationOpen] = useState(false);
  const [isViewDesignationOpen, setIsViewDesignationOpen] = useState(false);
  const [designationForm, setDesignationForm] = useState("");

  // Manage Users - Employee state
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "76", workshopId: "Bike Masters", firstName: "OM PRAKASH", lastName: "DAS", username: "OMM", email: "manager@bikemasters.com", contact: "7978460890", designation: "Manager", pwdExpiry: "2026-12-01", mobileAuth: false, dob: "1991-05-15", address: "Bhubaneswar Hub" },
    { id: "1", workshopId: "Bike Masters", firstName: "UTTAM KUMAR", lastName: "MAHATA", username: "UTTAM", email: "uttam@bikemasters.com", contact: "8293013480", designation: "Technician", pwdExpiry: "2027-12-31", mobileAuth: false },
    { id: "2", workshopId: "Bike Masters", firstName: "ABHIJIT", lastName: "NAYAK", username: "ABINASH", email: "abhijit@bikemasters.com", contact: "7377189872", designation: "Supervisor", pwdExpiry: "2026-12-31", mobileAuth: false },
    { id: "3", workshopId: "Bike Masters", firstName: "ASIT", lastName: "KUMAR BEHERA", username: "ASIT80", email: "asit@bikemasters.com", contact: "7681879872", designation: "Supervisor", pwdExpiry: "2029-01-01", mobileAuth: true },
    { id: "4", workshopId: "Bike Masters", firstName: "ARUP", lastName: "BAYEN", username: "ARUP", email: "arup@bikemasters.com", contact: "7609929872", designation: "Supervisor", pwdExpiry: "2029-01-01", mobileAuth: true }
  ]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("76");
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isViewEmployeeOpen, setIsViewEmployeeOpen] = useState(false);
  const [viewEmployeeActiveSubTab, setViewEmployeeActiveSubTab] = useState<"profile" | "permissions">("profile");
  const [employeeForm, setEmployeeForm] = useState<Omit<Employee, "id" | "mobileAuth">>({
    workshopId: "Bike Masters", firstName: "", lastName: "", username: "", email: "", contact: "", designation: "Technician", pwdExpiry: "2027-12-31", dob: "", anniversary: "", address: ""
  });

  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [employeeFilterDesignation, setEmployeeFilterDesignation] = useState("All");

  // Manage Users - Permissions state
  const [userRoles, setUserRoles] = useState<UserRole[]>([
    { employeeId: "76", roleName: "Admin" },
    { employeeId: "76", roleName: "Buttons" },
    { employeeId: "76", roleName: "Executive" }
  ]);

  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    { id: "p1", employeeId: "76", roleCode: "Admin", widgetType: "Menu", menuHeader: "Manage Users", menuOption: "Manage Employees", permissions: "CRUD" },
    { id: "p2", employeeId: "76", roleCode: "Admin", widgetType: "Menu", menuHeader: "System Configuration", menuOption: "Manage Spares Master", permissions: "CRUD" },
    { id: "p3", employeeId: "76", roleCode: "Buttons", widgetType: "Button", widgetName: "EstimationButton", permissions: "show" },
    { id: "p4", employeeId: "76", roleCode: "Buttons", widgetType: "Button", widgetName: "ReadyButton", permissions: "show" },
    { id: "p5", employeeId: "76", roleCode: "Executive", widgetType: "Menu", menuHeader: "Reports", menuOption: "Business Reports", permissions: "CRUD" }
  ]);

  const [activePermissionsTab, setActivePermissionsTab] = useState<"roles" | "permissions">("roles");
  const [isAccessPanelOpen, setIsAccessPanelOpen] = useState(false);
  const [isPermDropdownOpen, setIsPermDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isPermDropdownOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".permissions-dropdown-container")) {
        setIsPermDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isPermDropdownOpen]);

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isAddPermissionModalOpen, setIsAddPermissionModalOpen] = useState(false);

  const [roleForm, setRoleForm] = useState({ roleCode: "Admin" });
  const [permissionForm, setPermissionForm] = useState({
    widgetType: "Button" as "Button" | "Menu" | "Page" | "Tab",
    widgetName: "EstimationButton",
    menuOption: "Business Reports",
    menuHeader: "Reports",
    menuLink: "workshop/businessReports",
    permissionLevel: "Create"
  });

  // Manage Users - Action Handlers
  const handleAddDesignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designationForm.trim()) {
      triggerToast("Designation name is required", "warn");
      return;
    }
    if (designations.includes(designationForm.trim())) {
      triggerToast("Designation already exists", "warn");
      return;
    }
    setDesignations(prev => [...prev, designationForm.trim()]);
    setDesignationForm("");
    setIsNewDesignationOpen(false);
    triggerToast("Designation created successfully!", "success");
  };

  const handleEditDesignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designationForm.trim()) {
      triggerToast("Designation name is required", "warn");
      return;
    }
    setDesignations(prev => prev.map(d => d === selectedDesignation ? designationForm.trim() : d));
    setSelectedDesignation(designationForm.trim());
    setDesignationForm("");
    setIsEditDesignationOpen(false);
    triggerToast("Designation updated successfully!", "success");
  };

  const handleDeleteDesignation = (name: string) => {
    setDesignations(prev => prev.filter(d => d !== name));
    triggerToast("Designation deleted successfully!", "warn");
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.username || !employeeForm.contact) {
      triggerToast("Please fill in all required fields (*)", "warn");
      return;
    }
    const newEmp: Employee = {
      id: `${Date.now()}`,
      workshopId: employeeForm.workshopId,
      firstName: employeeForm.firstName,
      lastName: employeeForm.lastName,
      username: employeeForm.username,
      email: employeeForm.email || "",
      contact: employeeForm.contact,
      designation: employeeForm.designation,
      pwdExpiry: employeeForm.pwdExpiry,
      mobileAuth: false,
      dob: employeeForm.dob,
      anniversary: employeeForm.anniversary,
      address: employeeForm.address
    };
    setEmployees(prev => [...prev, newEmp]);
    setEmployeeForm({
      workshopId: "Bike Masters", firstName: "", lastName: "", username: "", email: "", contact: "", designation: "Technician", pwdExpiry: "2027-12-31", dob: "", anniversary: "", address: ""
    });
    setIsEmployeeModalOpen(false);
    triggerToast(`Employee ${newEmp.firstName} registered successfully!`, "success");
  };

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployees(prev => prev.map(emp => {
      if (emp.id === selectedEmployeeId) {
        return {
          ...emp,
          workshopId: employeeForm.workshopId,
          firstName: employeeForm.firstName,
          lastName: employeeForm.lastName,
          username: employeeForm.username,
          email: employeeForm.email || "",
          contact: employeeForm.contact,
          designation: employeeForm.designation,
          pwdExpiry: employeeForm.pwdExpiry,
          dob: employeeForm.dob,
          anniversary: employeeForm.anniversary,
          address: employeeForm.address
        };
      }
      return emp;
    }));
    setIsEditEmployeeOpen(false);
    triggerToast("Employee profile updated successfully!", "success");
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    triggerToast("Employee deleted from system roster!", "warn");
  };

  const handleToggleMobileAuth = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const nextState = !emp.mobileAuth;
        triggerToast(`Mobile Auth ${nextState ? "Enabled" : "Disabled"} for ${emp.firstName}`, "info");
        return { ...emp, mobileAuth: nextState };
      }
      return emp;
    }));
  };

  const handleAddRoleCode = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = userRoles.some(r => r.employeeId === selectedEmployeeId && r.roleName === roleForm.roleCode);
    if (exists) {
      triggerToast("Role is already assigned to this employee", "warn");
      return;
    }
    const newRole: UserRole = {
      employeeId: selectedEmployeeId,
      roleName: roleForm.roleCode
    };
    setUserRoles(prev => [...prev, newRole]);
    setIsAddRoleModalOpen(false);
    triggerToast("Role assigned successfully!", "success");
  };

  const handleDeleteUserRole = (roleName: string) => {
    setUserRoles(prev => prev.filter(r => !(r.employeeId === selectedEmployeeId && r.roleName === roleName)));
    triggerToast(`Role ${roleName} unassigned successfully!`, "warn");
  };

  const handleAddPermission = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerm: UserPermission = {
      id: `p-${Date.now()}`,
      employeeId: selectedEmployeeId,
      roleCode: activePermissionsTab === "roles" ? "Admin" : "Executive",
      widgetType: permissionForm.widgetType,
      widgetName: permissionForm.widgetType === "Button" ? permissionForm.widgetName : undefined,
      menuOption: permissionForm.widgetType === "Menu" ? permissionForm.menuOption : undefined,
      menuHeader: permissionForm.widgetType === "Menu" ? permissionForm.menuHeader : undefined,
      menuLink: permissionForm.widgetType === "Menu" ? permissionForm.menuLink : undefined,
      permissions: permissionForm.permissionLevel === "CRUD" ? "CRUD" : permissionForm.permissionLevel
    };
    setUserPermissions(prev => [...prev, newPerm]);
    setIsAddPermissionModalOpen(false);
    triggerToast("Granular access permission granted!", "success");
  };

  const handleDeletePermission = (id: string) => {
    setUserPermissions(prev => prev.filter(p => p.id !== id));
    triggerToast("Permission rule deleted successfully!", "warn");
  };

  // Reports State Definitions
  const [selectedReportId, setSelectedReportId] = useState<string>("day-book");
  const [reportDateFrom, setReportDateFrom] = useState("2026-05-01");
  const [reportDateTo, setReportDateTo] = useState("2026-05-29");
  const [reportFilterStatus, setReportFilterStatus] = useState("All");
  const [reportSearchText, setReportSearchText] = useState("");
  const [reportPaginationPage, setReportPaginationPage] = useState(1);

  // Mock Database for Reports
  const DAY_BOOK_DATA = [
    { id: "TX-001", date: "29 May 2026", particulars: "Regular Service (JC-123)", type: "Credit", amount: 1450, mode: "UPI" },
    { id: "TX-002", date: "29 May 2026", particulars: "Parts Restock Purchase (PO-991)", type: "Debit", amount: 5600, mode: "Card" },
    { id: "TX-003", date: "29 May 2026", particulars: "Accidental Service (JC-125)", type: "Credit", amount: 2000, mode: "Cash" },
    { id: "TX-004", date: "28 May 2026", particulars: "Engine Oil Bulk Purchase", type: "Debit", amount: 12000, mode: "Bank Transfer" },
    { id: "TX-005", date: "28 May 2026", particulars: "Express Wash Combo (JC-124)", type: "Credit", amount: 850, mode: "UPI" },
    { id: "TX-006", date: "27 May 2026", particulars: "Tire Replacement Labor", type: "Credit", amount: 1200, mode: "UPI" }
  ];

  const INVOICE_REPORT_DATA = [
    { invoiceNo: "INV-2026-001", jobCardNo: "JC-BBR-2026-00123", date: "29 May 2026", customerName: "Aditya Pradhan", subtotal: 1229, tax: 221, total: 1450, status: "Paid" },
    { invoiceNo: "INV-2026-002", jobCardNo: "JC-BBR-2026-00124", date: "29 May 2026", customerName: "Priya Sharma", subtotal: 720, tax: 130, total: 850, status: "Paid" },
    { invoiceNo: "INV-2026-003", jobCardNo: "JC-BBR-2026-00125", date: "28 May 2026", customerName: "Devendra Mishra", subtotal: 4576, tax: 824, total: 5400, status: "Partially Paid" },
    { invoiceNo: "INV-2026-004", jobCardNo: "JC-BBR-2026-00126", date: "29 May 2026", customerName: "Rohan Das", subtotal: 2373, tax: 427, total: 2800, status: "Pending" }
  ];

  const SPARES_CONSUMPTION_DATA = [
    { partNo: "BP-HON-098", name: "Front Brake Shoe Assembly", category: "Brakes", qty: 8, unitPrice: 350, total: 2800, costCenter: "Standard Bay" },
    { partNo: "SP-OIL-12", name: "Engine Oil Premium 10W30", category: "Fluids", qty: 32, unitPrice: 450, total: 14400, costCenter: "Standard Bay" },
    { partNo: "SPK-PLG-01", name: "Spark Plug Champion Premium", category: "Electricals", qty: 17, unitPrice: 120, total: 2040, costCenter: "Regular Servicing" },
    { partNo: "SP-FRK-12", name: "Front Fork Pipe Set Assembly", category: "Suspension", qty: 3, unitPrice: 2800, total: 8400, costCenter: "Accidental Bay" }
  ];

  const TECHNICIAN_PRODUCTIVITY_DATA = [
    { name: "Manoj Kumar", tickets: 14, avgTat: 42, targetTat: 60, efficiency: 112, incentives: 1500 },
    { name: "Ramesh Naik", tickets: 19, avgTat: 35, targetTat: 60, efficiency: 125, incentives: 2400 },
    { name: "Sanjay Rout", tickets: 8, avgTat: 75, targetTat: 70, efficiency: 93, incentives: 500 }
  ];

  const GST_FILING_DATA = [
    { name: "Aditya Pradhan", gstin: "URP (Unregistered)", invNo: "INV-2026-001", date: "29 May 2026", taxableVal: 1229, rate: 18, cgst: 110.5, sgst: 110.5, totalGst: 221 },
    { name: "Priya Sharma", gstin: "URP (Unregistered)", invNo: "INV-2026-002", date: "29 May 2026", taxableVal: 720, rate: 18, cgst: 65, sgst: 65, totalGst: 130 },
    { name: "Devendra Mishra", gstin: "21ABCDF1234F1ZX", invNo: "INV-2026-003", date: "28 May 2026", taxableVal: 4576, rate: 18, cgst: 412, sgst: 412, totalGst: 824 },
    { name: "Rohan Das", gstin: "URP (Unregistered)", invNo: "INV-2026-004", date: "29 May 2026", taxableVal: 2373, rate: 18, cgst: 213.5, sgst: 213.5, totalGst: 427 }
  ];

  const VENDOR_PURCHASE_DATA = [
    { poNo: "PO-9081", vendor: "Lucas TVS Distributor", date: "12 May 2026", item: "Front Brake Shoes (50 Pcs)", qty: 50, value: 14000, status: "Paid" },
    { poNo: "PO-8991", vendor: "Castrol Depot Bhubaneswar", date: "15 Apr 2026", item: "Engine Oil Bulk (40 Units)", qty: 40, value: 15200, status: "Paid" },
    { poNo: "PO-7712", vendor: "Bosch Auto Parts Odisha", date: "10 Feb 2026", item: "Spark Plugs Bulk (20 Pcs)", qty: 20, value: 1800, status: "Paid" },
    { poNo: "PO-9901", vendor: "Endurance Systems Depot", date: "05 May 2026", item: "Fork Pipes (15 Sets)", qty: 15, value: 33000, status: "Pending" }
  ];

  const CUSTOMER_SOURCE_DATA = [
    { source: "Google Search Map", count: 48, revenue: 68900, ticketSize: 1435 },
    { source: "Walk-in Board Signage", count: 32, revenue: 41200, ticketSize: 1287 },
    { source: "Friend / Referral Mention", count: 24, revenue: 38400, ticketSize: 1600 },
    { source: "WhatsApp Blast Campaign", count: 18, revenue: 29800, ticketSize: 1655 },
    { source: "Instagram Story Ad", count: 12, revenue: 15400, ticketSize: 1283 }
  ];

  const STOCK_MOVEMENT_DATA = [
    { name: "Front Brake Shoe Assembly", code: "BP-HON-098", opening: 40, stockIn: 50, stockOut: 45, transfer: 0, closing: 45 },
    { name: "Engine Oil Premium 10W30", code: "SP-OIL-12", opening: 10, stockIn: 40, stockOut: 32, transfer: 10, closing: 8 },
    { name: "Spark Plug Champion Premium", code: "SPK-PLG-01", opening: 5, stockIn: 20, stockOut: 17, transfer: 5, closing: 3 },
    { name: "Front Fork Pipe Set Assembly", code: "SP-FRK-12", opening: 0, stockIn: 15, stockOut: 3, transfer: 0, closing: 12 }
  ];

  const getFilteredReportData = () => {
    let rawData: any[] = [];
    switch (selectedReportId) {
      case "day-book":
        rawData = DAY_BOOK_DATA;
        break;
      case "invoice":
        rawData = INVOICE_REPORT_DATA;
        break;
      case "spares-consumption":
        rawData = SPARES_CONSUMPTION_DATA;
        break;
      case "technician-productivity":
        rawData = TECHNICIAN_PRODUCTIVITY_DATA;
        break;
      case "gst-filing":
        rawData = GST_FILING_DATA;
        break;
      case "vendor-purchase":
        rawData = VENDOR_PURCHASE_DATA;
        break;
      case "customer-source":
        rawData = CUSTOMER_SOURCE_DATA;
        break;
      case "stock-movement":
        rawData = STOCK_MOVEMENT_DATA;
        break;
      default:
        rawData = DAY_BOOK_DATA;
    }

    // Filter by search text
    if (reportSearchText.trim() !== "") {
      const query = reportSearchText.toLowerCase();
      rawData = rawData.filter((item: any) => {
        return Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(query)
        );
      });
    }

    // Filter by date range (if the item has a 'date' field)
    if (reportDateFrom && reportDateTo) {
      rawData = rawData.filter((item: any) => {
        if (!item.date) return true;
        try {
          const itemTime = new Date(item.date).getTime();
          const fromTime = new Date(reportDateFrom).getTime();
          const toTime = new Date(reportDateTo).getTime();
          if (isNaN(itemTime)) return true;
          return itemTime >= fromTime && itemTime <= toTime;
        } catch (e) {
          return true;
        }
      });
    }

    // Filter by status (if applicable and not "All")
    if (reportFilterStatus !== "All") {
      rawData = rawData.filter((item: any) => {
        if (item.status) {
          if (reportFilterStatus === "Paid") return item.status === "Paid";
          if (reportFilterStatus === "Pending") return item.status === "Pending" || item.status === "Partially Paid";
        }
        if (item.type) {
          if (reportFilterStatus === "Credit") return item.type === "Credit";
          if (reportFilterStatus === "Debit") return item.type === "Debit";
        }
        return true;
      });
    }

    return rawData;
  };

  const downloadExcelData = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      triggerToast("No data available to export!", "warn");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] === undefined || row[header] === null ? "" : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`${filename}.csv spreadsheet generated successfully!`, "success");
  };

  const handleExportReport = (format: "excel" | "csv" | "pdf") => {
    const data = getFilteredReportData();
    const reportName = selectedReportId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (format === "pdf") {
      triggerToast(`Compiling ${reportName} PDF. Select 'Save as PDF' in the destination print option!`, "success");
      setTimeout(() => {
        window.print();
      }, 700);
    } else {
      downloadExcelData(data, selectedReportId);
    }
  };

  // Load jobs from NestJS Backend dynamically
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/job-cards?status=${activeFilter}&search=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
          if (data.length > 0) {
            // Find if current selectedJob is in fetched list
            const currentSelected = data.find((j: JobCard) => selectedJob && j.id === selectedJob.id);
            setSelectedJob(currentSelected || data[0]);
          } else {
            setSelectedJob(null);
          }
        }
      } catch (err) {
        console.error("Backend connection down. Falling back to local data.", err);
      }
    };
    fetchJobs();
  }, [activeFilter, searchQuery]);

  // Load employees from Backend dynamically
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`);
        if (res.ok) {
          const data = await res.json();
          const techs = data.filter((e: any) => e.role === 'technician').map((e: any) => e.name);
          const advisors = data.filter((e: any) => e.role === 'advisor' || e.role === 'supervisor').map((e: any) => e.name);
          if (techs.length > 0) setTechniciansList(techs);
          if (advisors.length > 0) setSupervisorsList(advisors);
        }
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);
  // Progress and Action Handlers
  const handleJobAction = async (job: JobCard, action: string) => {
    let updates: Partial<JobCard> = {};
    const currentProgress = job.completion;

    if (action === "Status") {
      if (!job.isEstimated) {
        triggerToast("Please complete estimation first!", "warn");
        return;
      }
      setSelectedJob(job);
      setSelectedStatus(job.status);
      setStatusNote("");
      setIsStatusModalOpen(true);
      return;
    } else if (action === "JC/Est" || action === "JC/ Est") {
      router.push(`/estimation/${job.id}`);
      return; // Handled by navigation
    } else if (action === "Payments") {
      setSelectedJob(job);
      setIsPaymentModalOpen(true);
      return;
    } else if (action === "Discount") {
      if (!job.isEstimated) {
        triggerToast("Discount can only be applied after estimation!", "warn");
        return;
      }
      setSelectedJob(job);
      const spareItems = job.spares.map((s, i) => ({
        key: `spare-${i}`, name: s.name, total: s.price * s.qty, type: "amount" as const, value: 0, isSpare: true,
      }));
      const serviceItems = job.services.map((s, i) => ({
        key: `svc-${i}`, name: s.name, total: s.rate, type: "amount" as const, value: 0, isSpare: false,
      }));
      setDiscountForm({ overallType: "amount", overallValue: job.overallDiscount || 0, lineItems: [...spareItems, ...serviceItems] });
      setSelectedOfferId(null);
      fetch(`${API_BASE_URL}/offers`).then(r => r.json()).then(data => setAvailableOffers(data || [])).catch(() => setAvailableOffers([]));
      setIsDiscountModalOpen(true);
      return;
    } else if (action === "History") {
      setHistoryVehicleNo(job.vehicleNo);
      setHistoryRows([]);
      setIsHistoryModalOpen(true);
      setHistoryLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/vehicles/${encodeURIComponent(job.vehicleNo)}/history`);
        if (res.ok) setHistoryRows(await res.json());
      } catch { /* show empty */ }
      setHistoryLoading(false);
      return;
    } else if (action === "Invoice") {
      setSelectedJob(job);
      setIsInvoiceModalOpen(true);
      fetch(`${API_BASE_URL}/job-cards/${job.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completion: 95 }) }).then(r => r.ok && r.json()).then(u => u && setJobs(prev => prev.map(j => j.id === u.id ? u : j))).catch(() => setJobs(prev => prev.map(j => j.id === job.id ? { ...j, completion: 95 } : j)));
      addTimelineEntry(job.id, "Invoice Generated", `Tax invoice prepared for ${job.vehicleNo}`);
      return;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/job-cards/${job.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const updated = await res.json();
          setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
          triggerToast(`Job card updated: ${action}`, "success");
        }
      } catch (err) {
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, ...updates } : j));
        triggerToast(`${action} updated (Local Fallback)`, "success");
      }
    }
  };

  // State for new feature modals
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [availableOffers, setAvailableOffers] = useState<{ id: string; title: string; description: string; offerType: string; discountValue: number; endDate: string }[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyVehicleNo, setHistoryVehicleNo] = useState("");
  const [historyRows, setHistoryRows] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    card: 0, cash: 0, cheque: 0, other: 0, remarks: ""
  });
  const [discountForm, setDiscountForm] = useState<{
    overallType: "percentage" | "amount";
    overallValue: number;
    lineItems: Array<{ key: string; name: string; total: number; type: "percentage" | "amount"; value: number; isSpare: boolean }>;
  }>({ overallType: "amount", overallValue: 0, lineItems: [] });

  const addTimelineEntry = (jobId: string, title: string, desc: string) => {
    const entry = { time: new Date().toISOString(), title, desc };
    const patch = (j: JobCard) => j.id === jobId ? { ...j, timeline: [...(j.timeline || []), entry] } : j;
    setJobs(prev => prev.map(patch));
    setSelectedJob(prev => prev && prev.id === jobId ? { ...prev, timeline: [...(prev.timeline || []), entry] } : prev);
  };

  const handleSavePayment = async () => {
    if (!selectedJob) return;
    const totalPaid = Number(paymentForm.card) + Number(paymentForm.cash) + Number(paymentForm.cheque) + Number(paymentForm.other);
    const updates = {
      paid: selectedJob.paid + totalPaid,
      due: Math.max(0, selectedJob.estimate - (selectedJob.paid + totalPaid)),
      completion: 50,
      paymentBreakdown: {
        card: ((selectedJob as any).paymentBreakdown?.card || 0) + Number(paymentForm.card),
        cash: ((selectedJob as any).paymentBreakdown?.cash || 0) + Number(paymentForm.cash),
        cheque: ((selectedJob as any).paymentBreakdown?.cheque || 0) + Number(paymentForm.cheque),
        other: ((selectedJob as any).paymentBreakdown?.other || 0) + Number(paymentForm.other),
        remarks: paymentForm.remarks,
      },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/job-cards/${selectedJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
        addTimelineEntry(selectedJob.id, "Advance Payment Done", `₹${totalPaid} received via ${[paymentForm.card > 0 && 'Card', paymentForm.cash > 0 && 'Cash', paymentForm.cheque > 0 && 'Cheque', paymentForm.other > 0 && 'Other'].filter(Boolean).join(', ') || 'Payment'}`);
        setIsPaymentModalOpen(false);
        triggerToast("Payment recorded successfully!", "success");
      }
    } catch (err) {
      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...updates } : j));
      addTimelineEntry(selectedJob.id, "Advance Payment Done", `₹${totalPaid} received`);
      setIsPaymentModalOpen(false);
      triggerToast("Payment recorded (Local Fallback)", "success");
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedJob || !selectedStatus) return;
    const updates = { status: selectedStatus, statusNote };
    try {
      const res = await fetch(`${API_BASE_URL}/job-cards/${selectedJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
        setSelectedJob(prev => prev && prev.id === updated.id ? updated : prev);
      } else {
        throw new Error("API error");
      }
    } catch {
      const STATUS_COMPLETION_FE: Record<string, number> = {
        "Client Agreed": 30, "Work in Progress": 50, "Work on Hold": 45,
        "Work Completed": 80, "Out for Delivery": 90, "Delivered": 100,
      };
      const completion = STATUS_COMPLETION_FE[selectedStatus] ?? selectedJob.completion;
      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: selectedStatus, completion } : j));
      setSelectedJob(prev => prev && prev.id === selectedJob.id ? { ...prev, status: selectedStatus, completion } : prev);
      addTimelineEntry(selectedJob.id, `Status: ${selectedStatus}`, statusNote || `Updated to ${selectedStatus}`);
    }
    setIsStatusModalOpen(false);
    triggerToast(`Status updated to "${selectedStatus}"`, "success");
  };

  const handleSaveDiscount = async () => {
    if (!selectedJob) return;
    const lineTotal = discountForm.lineItems.reduce((sum, item) => {
      const d = item.type === "percentage" ? (item.total * item.value / 100) : item.value;
      return sum + Math.min(d, item.total);
    }, 0);
    const overallAmt = discountForm.overallType === "percentage"
      ? (selectedJob.estimate * discountForm.overallValue / 100)
      : discountForm.overallValue;
    const totalDiscount = Math.min(Math.round((lineTotal + overallAmt) * 100) / 100, selectedJob.estimate);
    const updates = {
      overallDiscount: totalDiscount,
      due: Math.max(0, selectedJob.estimate - selectedJob.paid - totalDiscount),
    };
    try {
      const res = await fetch(`${API_BASE_URL}/job-cards/${selectedJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
        addTimelineEntry(selectedJob.id, "Discount Applied", `₹${totalDiscount} total discount applied`);
        setIsDiscountModalOpen(false);
        triggerToast("Discount applied successfully!", "success");
      } else throw new Error();
    } catch {
      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...updates } : j));
      addTimelineEntry(selectedJob.id, "Discount Applied", `₹${totalDiscount} total discount applied`);
      setIsDiscountModalOpen(false);
      triggerToast("Discount applied!", "success");
    }
  };

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isManageUsersExpanded, setIsManageUsersExpanded] = useState(true);
  
  // Tab control inside Side Panel
  const [sidePanelTab, setSidePanelTab] = useState("Overview");
  const [isEditingSidePanel, setIsEditingSidePanel] = useState(false);
  const [editedJob, setEditedJob] = useState<JobCard | null>(null);

  // State for Toast Notifications
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: "success" | "info" | "warn" }>>([]);

  // State for Customer Search/Typeahead in Modal
  const [vehicleSearchText, setVehicleSearchText] = useState("");
  const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);

  // Catalogs and inline additions lists
  const [vehicleCategories, setVehicleCategories] = useState(['Scooter', 'Motorcycle', 'Electric Scooter', 'Superbike', 'Cruiser']);
  const [customerSources, setCustomerSources] = useState(['Walk-in', 'Referral', 'Online Booking', 'Facebook', 'Google Search']);
  const [techniciansList, setTechniciansList] = useState(['Manoj Kumar', 'Ramesh Naik', 'Sanjay Rout']);
  const [supervisorsList, setSupervisorsList] = useState(['Anil Dash', 'Subhashis Sen']);
  const [vehicleBrandsList, setVehicleBrandsList] = useState(['Honda', 'TVS', 'Bajaj', 'KTM', 'Yamaha', 'Suzuki', 'Hero']);

  // Known vehicles database for auto-population typeahead
  const MOCK_KNOWN_VEHICLES = [
    {
      regNo: "OD-05-AB-1234",
      name: "Aditya Pradhan",
      phone: "+91 98765 43210",
      email: "aditya@bikemaster.com",
      address: "Plot 104, Saheed Nagar, Bhubaneswar, Odisha",
      brand: "Honda",
      model: "Activa 6G",
      category: "Scooter",
      variant: "Deluxe",
      plateColor: "white",
      chassisNo: "MD2A1234567890",
      engineNo: "JA05E1234567",
      regDate: "2024-05-15",
      mfgYear: "2023"
    },
    {
      regNo: "OD-02-XY-9876",
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya@gmail.com",
      address: "Patia, Bhubaneswar, Odisha",
      brand: "TVS",
      model: "Jupiter 125",
      category: "Scooter",
      variant: "Disc",
      plateColor: "white",
      chassisNo: "MD3B9876543210",
      engineNo: "JA06E9876543",
      regDate: "2025-02-10",
      mfgYear: "2024"
    },
    {
      regNo: "MH-12-EV-2026",
      name: "Rohan Deshmukh",
      phone: "+91 76543 20987",
      email: "rohan@evlife.in",
      address: "Shivaji Nagar, Pune, Maharashtra",
      brand: "TVS",
      model: "iQube Electric",
      category: "Electric Scooter",
      variant: "S Edition",
      plateColor: "green",
      chassisNo: "MD4C2026112233",
      engineNo: "EV-MTR-8899",
      regDate: "2026-01-20",
      mfgYear: "2026"
    }
  ];

  // Inline modals control states
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isNewSourceModalOpen, setIsNewSourceModalOpen] = useState(false);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [employeeRoleType, setEmployeeRoleType] = useState<"technician" | "supervisor">("technician");
  const [isPlateInfoModalOpen, setIsPlateInfoModalOpen] = useState(false);

  // Success screen overlay state
  const [isSuccessOverlayOpen, setIsSuccessOverlayOpen] = useState(false);
  const [savedJobCardId, setSavedJobCardId] = useState("");
  const [savedJobCardDetails, setSavedJobCardDetails] = useState<any>(null);

  // Helper form fields for inline creation sub-modals
  const [newVehicleForm, setNewVehicleForm] = useState({ brand: "Honda", model: "", category: "Scooter", variant: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");

  // New Customer Form State
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    email: "",
    address: "",
    gstin: "",
    customerType: "individual",
    source: "Walk-in",
    regNo: "",
    brand: "",
    model: "",
    variant: "",
    category: "Scooter",
    plateColor: "white",
    chassisNo: "",
    engineNo: "",
    odometer: "",
    regDate: new Date().toISOString().split("T")[0],
    mfgYear: new Date().getFullYear().toString(),
    technician: "Manoj Kumar",
    supervisor: "Anil Dash"
  });

  const triggerToast = (msg: string, type: "success" | "info" | "warn" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    triggerToast(`Switched to ${nextTheme === "dark" ? "Dark" : "Light"} Mode`, "info");
  };

  // Mock vehicle database for typeahead search in Modal
  const MOCK_VEHICLE_DATABASE = [
    { brand: "Honda", model: "Activa 6G", category: "Scooter", variant: "Deluxe" },
    { brand: "Honda", model: "Activa 125", category: "Scooter", variant: "Standard" },
    { brand: "TVS", model: "Jupiter 125", category: "Scooter", variant: "Disc" },
    { brand: "TVS", model: "Ntorq 125", category: "Scooter", variant: "Race Edition" },
    { brand: "Bajaj", model: "Pulsar 150", category: "Motorcycle", variant: "Neon" },
    { brand: "Bajaj", model: "Pulsar NS200", category: "Motorcycle", variant: "ABS" },
    { brand: "KTM", model: "Duke 200", category: "Motorcycle", variant: "Standard" },
    { brand: "KTM", model: "RC 390", category: "Motorcycle", variant: "GP Edition" },
    { brand: "Yamaha", model: "R15 V4", category: "Motorcycle", variant: "Racing Blue" }
  ];

  const handleVehicleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVehicleSearchText(value);
    setNewCustomerForm(prev => ({ ...prev, brand: "", model: "", variant: "" }));
    if (value.trim().length >= 2) {
      setShowVehicleSuggestions(true);
    } else {
      setShowVehicleSuggestions(false);
    }
  };

  const selectVehicleSuggestion = (vehicle: typeof MOCK_VEHICLE_DATABASE[0]) => {
    setNewCustomerForm((prev) => ({
      ...prev,
      brand: vehicle.brand,
      model: vehicle.model,
      category: vehicle.category,
      variant: vehicle.variant
    }));
    setVehicleSearchText(`${vehicle.brand} ${vehicle.model} - ${vehicle.variant}`);
    setShowVehicleSuggestions(false);
    triggerToast(`Selected ${vehicle.brand} ${vehicle.model}! Auto-populated fields.`, "success");
  };

  // Typeahead search for existing known vehicle registrations
  const [matchingRegNoList, setMatchingRegNoList] = useState<typeof MOCK_KNOWN_VEHICLES>([]);
  const [showRegSuggestions, setShowRegSuggestions] = useState(false);

  const handleRegNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.toUpperCase();
    setNewCustomerForm(prev => ({ ...prev, regNo: text }));
    if (text.trim().length >= 3) {
      const filtered = MOCK_KNOWN_VEHICLES.filter(v => v.regNo.includes(text));
      setMatchingRegNoList(filtered);
      setShowRegSuggestions(filtered.length > 0);
    } else {
      setShowRegSuggestions(false);
    }
  };

  const selectRegNoSuggestion = (veh: typeof MOCK_KNOWN_VEHICLES[0]) => {
    setNewCustomerForm(prev => ({
      ...prev,
      regNo: veh.regNo,
      name: veh.name,
      phone: veh.phone,
      email: veh.email,
      address: veh.address,
      brand: veh.brand,
      model: veh.model,
      variant: veh.variant,
      category: veh.category,
      plateColor: veh.plateColor,
      chassisNo: veh.chassisNo,
      engineNo: veh.engineNo,
      regDate: veh.regDate,
      mfgYear: veh.mfgYear
    }));
    setVehicleSearchText(`${veh.brand} ${veh.model} - ${veh.variant}`);
    setShowRegSuggestions(false);
    triggerToast(`Existing vehicle ${veh.regNo} found! Customer details auto-populated.`, "success");
  };

  // Handle saving customer
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone || !newCustomerForm.regNo || !newCustomerForm.brand || !newCustomerForm.model) {
      triggerToast("Please fill all required fields (*) and select a valid Brand & Model", "warn");
      return;
    }

    const payload = {
      vehicleNo: newCustomerForm.regNo.toUpperCase(),
      brandModel: `${newCustomerForm.brand} ${newCustomerForm.model}`,
      customerName: newCustomerForm.name,
      phone: newCustomerForm.phone,
      kms: parseInt(newCustomerForm.odometer || "0") || 5000,
      advisor: newCustomerForm.supervisor,
      technician: newCustomerForm.technician,
      urgency: "Medium",
      estimate: 450,
      paid: 0,
      due: 450,
      serviceType: newCustomerForm.category === "Scooter" || newCustomerForm.category === "Motorcycle" ? "Regular" : "Express"
    };

    try {
      const res = await fetch(`${API_BASE_URL}/job-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newJob = await res.json();
        setJobs((prev) => [newJob, ...prev]);
        setSelectedJob(newJob);
        setSavedJobCardId(newJob.id);
        setSavedJobCardDetails(newJob);
        setIsModalOpen(false);
        setIsSuccessOverlayOpen(true);
        triggerToast(`Customer registered successfully!`, "success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Backend registration failed:", errorData);
        triggerToast(`Failed to save customer in database: ${errorData.message || "Unknown error"}`, "warn");
      }
    } catch (err) {
      console.error(err);
      // Local fallback in case backend is offline
      const fallbackJob: JobCard = {
        id: `JC-BBR-2026-00${jobs.length + 123}`,
        vehicleNo: payload.vehicleNo,
        brandModel: payload.brandModel,
        customerName: payload.customerName,
        phone: payload.phone,
        kms: payload.kms,
        completion: 10,
        status: "Under Servicing",
        advisor: payload.advisor,
        technician: payload.technician,
        urgency: payload.urgency,
        estimate: payload.estimate,
        paid: payload.paid,
        due: payload.due,
        serviceType: payload.serviceType,
        date: "29 May 2026",
        complaints: [{ text: "General service oil change", finding: "First routine maintenance check", action: "repair_now" }],
        spares: [],
        services: [{ name: "General Washing and Waxing", rate: 450, hsn: "SAC-9987", code: "SRV-WSH-01", status: "estimated" }],
        timeline: [
          { time: "Just Now", title: "Customer Registered", desc: "Registered via local fallback" }
        ]
      };
      setJobs((prev) => [fallbackJob, ...prev]);
      setSelectedJob(fallbackJob);
      setSavedJobCardId(fallbackJob.id);
      setSavedJobCardDetails(fallbackJob);
      setIsModalOpen(false);
      setIsSuccessOverlayOpen(true);
      triggerToast(`Customer registered (Local Fallback)!`, "success");
    }

    // Reset Form to defaults
    setNewCustomerForm({
      name: "",
      phone: "",
      altPhone: "",
      email: "",
      address: "",
      gstin: "",
      customerType: "individual",
      source: "Walk-in",
      regNo: "",
      brand: "",
      model: "",
      variant: "",
      category: "Scooter",
      plateColor: "white",
      chassisNo: "",
      engineNo: "",
      odometer: "",
      regDate: new Date().toISOString().split("T")[0],
      mfgYear: new Date().getFullYear().toString(),
      technician: "Manoj Kumar",
      supervisor: "Anil Dash"
    });
    setVehicleSearchText("");
  };

  // Status badge style helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Under Servicing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      case "Ready for Delivery":
        return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-900";
      case "Payment Processing":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900";
      case "Completed":
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 border-slate-200 dark:border-slate-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Urgency indicator border color
  const getUrgencyBorder = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "border-l-4 border-l-red-500 dark:border-l-red-600";
      case "Medium":
        return "border-l-4 border-l-amber-500 dark:border-l-amber-600";
      case "Low":
        default:
        return "border-l-4 border-l-blue-500 dark:border-l-blue-600";
    }
  };

  // Status groupings that map each UI status to a tab bucket
  const IN_PROGRESS_STATUSES = new Set([
    "Under Servicing", "Client Agreed", "Work in Progress", "Work on Hold", "Work Completed", "Draft",
  ]);
  const READY_STATUSES = new Set([
    "Ready for Delivery", "Out for Delivery", "Next Day Delivery", "Upcoming Delivery",
  ]);
  const PAYMENT_STATUSES = new Set(["Payment Processing"]);
  const COMPLETED_STATUSES = new Set(["Completed", "Delivered"]);

  // Filtering Logic
  const filteredJobs = jobs
    .filter((job) => {
      // 1. Status Filter
      if (activeFilter !== "All Jobs") {
        if (activeFilter === "Under Servicing" && !IN_PROGRESS_STATUSES.has(job.status)) return false;
        if (activeFilter === "Ready for Delivery" && !READY_STATUSES.has(job.status)) return false;
        if (activeFilter === "Payment Processing" && !PAYMENT_STATUSES.has(job.status)) return false;
        if (activeFilter === "Completed" && !COMPLETED_STATUSES.has(job.status)) return false;
      }
      // 2. Search query (regex or search string matches Customer name, Phone, or Vehicle No)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const nameMatch = job.customerName.toLowerCase().includes(q);
        const phoneMatch = job.phone.includes(q);
        const vehicleMatch = job.vehicleNo.toLowerCase().includes(q);
        const modelMatch = job.brandModel.toLowerCase().includes(q);
        return nameMatch || phoneMatch || vehicleMatch || modelMatch;
      }
      return true;
    })
    .sort((a, b) => b.id.localeCompare(a.id));

  // Calculate quick stats for filters — every status maps to exactly one tab
  const stats = {
    all: jobs.length,
    underServicing: jobs.filter((j) => IN_PROGRESS_STATUSES.has(j.status)).length,
    ready: jobs.filter((j) => READY_STATUSES.has(j.status)).length,
    payment: jobs.filter((j) => PAYMENT_STATUSES.has(j.status)).length,
    completed: jobs.filter((j) => COMPLETED_STATUSES.has(j.status)).length,
  };

  // -------------------------------------------------------------
  // AUTHENTICATION LOGIN & LOGOUT HANDLERS
  // -------------------------------------------------------------

  // Role → allowed nav tabs
  const ROLE_TABS: Record<string, string[]> = {
    super_admin:     ["*"],
    org_admin:       ["*"],
    garage_manager:  ["*"],
    service_advisor: ["Dashboard","Service Queue","Customers","CRM","Inventory Management","View Service History"],
    technician:      ["Dashboard","Service Queue"],
    cashier:         ["Dashboard","Service Queue","Payments","Report By Invoices"],
    viewer:          ["Dashboard","BI Analytics","GST Filing Reports","By Insurance Claim","Report By Invoices"],
  };

  const canAccessTab = (tab: string) => {
    if (!currentUser) return false;
    const allowed = ROLE_TABS[currentUser.role] ?? [];
    if (allowed.includes("*")) return true;
    return allowed.includes(tab);
  };

  // Role display label
  const ROLE_LABELS: Record<string, string> = {
    super_admin:    "Super Admin",
    org_admin:      "Org Admin",
    garage_manager: "Garage Manager",
    service_advisor:"Service Advisor",
    technician:     "Technician",
    cashier:        "Cashier",
    viewer:         "Viewer",
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      triggerToast("Please enter both username and password!", "warn");
      return;
    }

    // Offline fallback users (mirrors API DEMO_USERS)
    const FALLBACK_USERS = [
      { username: "admin",   password: "admin123",   role: "super_admin",    name: "Aditya Pradhan", id: "u1", garageCode: "BBR-001" },
      { username: "manager", password: "manager123", role: "garage_manager", name: "Subhashis Sen",  id: "u2", garageCode: "BBR-001" },
      { username: "advisor", password: "advisor123", role: "service_advisor",name: "Priya Sharma",   id: "u3", garageCode: "BBR-001" },
      { username: "tech",    password: "tech123",    role: "technician",     name: "Ravi Kumar",     id: "u4", garageCode: "BBR-001" },
      { username: "cashier", password: "cashier123", role: "cashier",        name: "Anita Das",      id: "u5", garageCode: "BBR-001" },
    ];

    const saveSession = (user: typeof FALLBACK_USERS[0], token: string) => {
      const session = { ...user, token };
      setCurrentUser(session);
      setIsLoggedIn(true);
      localStorage.setItem("bikemaster_session", JSON.stringify(session));
      // Set first allowed tab for this role
      const allowed = ROLE_TABS[user.role] ?? [];
      if (!allowed.includes("*") && allowed.length > 0) setActiveTab(allowed[0]);
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(data.user, data.access_token);
        triggerToast(`Welcome back, ${data.user.name}!`, "success");
      } else {
        // API rejected — try local fallback before showing error
        const match = FALLBACK_USERS.find(
          (u) => u.username === usernameInput && u.password === passwordInput,
        );
        if (match) {
          saveSession(match, "offline-token");
          triggerToast(`Welcome back, ${match.name}!`, "success");
        } else {
          triggerToast("Invalid username or password.", "warn");
        }
      }
    } catch {
      // Backend offline — use local fallback
      const match = FALLBACK_USERS.find(
        (u) => u.username === usernameInput && u.password === passwordInput,
      );
      if (match) {
        saveSession(match, "offline-token");
        triggerToast(`Welcome back, ${match.name}! (Offline mode)`, "success");
      } else {
        triggerToast("Invalid credentials.", "warn");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("bikemaster_session");
    setUsernameInput("");
    setPasswordInput("");
    triggerToast("Logged out successfully.", "info");
  };

  // -------------------------------------------------------------
  // HELPER METHODS FOR 20 NEW CONFIG, REPORTS, AND WORKSHOP TABS
  // -------------------------------------------------------------

  const getCrudSchema = (tab: string) => {
    switch (tab) {
      case "Brandwise Consumables":
        return [
          { name: "brand", label: "Brand", type: "select", options: ["BOSCH", "NIKAVI", "HP", "VALVOLINE", "YAMAHA", "HITECH", "MCLARINE"] },
          { name: "name", label: "Consumable Name", type: "text", required: true },
          { name: "code", label: "Category Code", type: "text", required: true },
        ];
      case "Consumable Brands":
        return [
          { name: "name", label: "Consumables Brand Name", type: "text", required: true },
        ];
      case "Customer Source":
        return [
          { name: "company", label: "Company Name", type: "text", required: true },
          { name: "gstin", label: "GST Number", type: "text" },
          { name: "email", label: "Email ID", type: "text" },
          { name: "contact", label: "Contact No", type: "text", required: true },
          { name: "person", label: "Contact Person", type: "text", required: true },
          { name: "address", label: "Address", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "sms", label: "SMS Reminders", type: "select", options: ["Yes", "No"] },
          { name: "date", label: "Register Date", type: "date" },
        ];
      case "Insurance Provider":
        return [
          { name: "name", label: "Insurance Provider Name", type: "text", required: true },
          { name: "gstin", label: "GST Number", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "contact", label: "Contact Number", type: "text" },
          { name: "email", label: "Email ID", type: "text" },
        ];
      case "Spares Master":
        return [
          { name: "name", label: "Parts Name", type: "text", required: true },
          { name: "code", label: "Category Code", type: "select", options: ["Spares", "Consumables"] },
        ];
      case "Vehicle Category":
        return [
          { name: "name", label: "Vehicle Category Name", type: "text", required: true },
        ];
      case "Vehicle Models":
        return [
          { name: "brand", label: "Vehicle Brand", type: "text", required: true },
          { name: "model", label: "Vehicle Model", type: "text", required: true },
          { name: "variant", label: "Vehicle Variant", type: "text", required: true },
        ];
      case "Workshop Info":
        return [
          { name: "id", label: "Workshop ID", type: "text", required: true },
          { name: "name", label: "Workshop Name", type: "text", required: true },
          { name: "location", label: "Location", type: "text", required: true },
          { name: "address", label: "Address", type: "text" },
          { name: "pin", label: "Pincode", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "person", label: "Contact Person Name", type: "text" },
          { name: "contact", label: "Contact Number", type: "text" },
          { name: "email", label: "Email ID", type: "text" },
          { name: "tin", label: "TIN Number", type: "text" },
          { name: "company", label: "Company Name", type: "text" },
          { name: "cin", label: "CIN Number", type: "text" },
          { name: "serviceTax", label: "Service Tax Number", type: "text" },
        ];
      case "Manage Services":
        return [
          { name: "name", label: "Service Name", type: "text", required: true },
          { name: "category", label: "Vehicle Category", type: "text", required: true },
          { name: "code", label: "Category Code", type: "text", required: true },
          { name: "amount", label: "Amount", type: "number", required: true },
        ];
      default:
        return [];
    }
  };

  const renderGenericCrudGrid = (
    title: string,
    list: any[],
    setList: any,
    columns: { key: string; label: string; cell?: (val: any, row: any) => React.ReactNode }[],
    canCreate = true,
    canDelete = true
  ) => {
    const q = crudFormSearchQuery.toLowerCase();
    const filtered = list.filter((item) => {
      return Object.values(item).some(
        (val) => val && val.toString().toLowerCase().includes(q)
      );
    });

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                <span>System Configuration</span>
                <span className="h-1 w-1 rounded-full bg-slate-350" />
                <span>Total Items: {list.length}</span>
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                {title}
              </h2>
            </div>
            
            {canCreate && (
              <button
                onClick={() => {
                  const schema = getCrudSchema(activeTab);
                  const initialForm: any = {};
                  schema.forEach((f) => {
                    initialForm[f.name] = f.type === "select" ? (f.options?.[0] || "") : "";
                  });
                  setCrudForm(initialForm);
                  setCrudModalMode("new");
                  setCrudSelectedId(null);
                  setIsCrudModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ New</span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={crudFormSearchQuery}
                onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                placeholder={`Search through ${title.toLowerCase()} database...`}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold"
              />
            </div>
          </div>

          {/* Data Grid */}
          <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-4 px-5 w-16 text-center">S.No</th>
                    {columns.map((col) => (
                      <th key={col.key} className="py-4 px-5">{col.label}</th>
                    ))}
                    <th className="py-4 px-5 w-32 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 2} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                        No records found matching search filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                        <td className="py-3.5 px-5 text-center font-bold text-slate-400">{idx + 1}</td>
                        {columns.map((col) => (
                          <td key={col.key} className="py-3.5 px-5 font-semibold">
                            {col.cell ? col.cell(row[col.key], row) : (row[col.key]?.toString() || "—")}
                          </td>
                        ))}
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => {
                                setCrudForm({ ...row });
                                setCrudModalMode("view");
                                setCrudSelectedId(row.id);
                                setIsCrudModalOpen(true);
                              }}
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                              title="👁️ View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setCrudForm({ ...row });
                                setCrudModalMode("edit");
                                setCrudSelectedId(row.id);
                                setIsCrudModalOpen(true);
                              }}
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-650 transition-colors"
                              title="✏️ Edit Record"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {canDelete && (
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this record?")) {
                                    if (activeTab === "Manage Services") {
                                      try {
                                        await fetch(`${API_BASE_URL}/services-master/${row.id}`, { method: "DELETE" });
                                        setList(list.filter((item) => item.id !== row.id));
                                        triggerToast("Service deleted successfully", "success");
                                      } catch (err) {
                                        console.error("Failed to delete service", err);
                                        triggerToast("Backend offline, deleting locally", "warn");
                                        setList(list.filter((item) => item.id !== row.id));
                                      }
                                    } else {
                                      setList(list.filter((item) => item.id !== row.id));
                                      triggerToast("Record deleted successfully", "success");
                                    }
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                title="🗑️ Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 font-bold text-[10px] uppercase text-slate-400 tracking-wider">
              <span>Displaying {filtered.length} of {list.length} records</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkshopConfigOrReports = () => {
    switch (activeTab) {
      // ==========================================
      // SECTION A — BUSINESS REPORTS
      // ==========================================
      case "GST Filing Reports": {
        const filteredInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.date);
          const start = new Date(reportStartDate);
          const end = new Date(reportEndDate);
          return invDate >= start && invDate <= end;
        });

        const gstItems = filteredInvoices.map(inv => ({
          id: inv.id,
          invoiceNo: inv.invoiceNo,
          date: inv.date,
          customer: inv.customerName,
          gstin: inv.gstin,
          subtotal: inv.subtotal,
          total: inv.totalAmount,
          insurance: inv.insuranceAmount,
          discount: inv.discountAmount,
          payable: inv.totalAmount - inv.insuranceAmount, // Assumption: payable is net after insurance
          paid: inv.paidAmount,
          due: inv.dueAmount
        }));

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Taxation Ledger</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>GSTR-1 & GSTR-3B Compliant</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    GST Filing Reports
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button onClick={() => window.print()} className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-[10px] uppercase font-extrabold shadow-sm active:scale-95 transition-all">
                    <span>🖨️ Print Bill</span>
                  </button>
                  <div className="relative group">
                    <button className="flex items-center space-x-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl text-[10px] uppercase font-extrabold shadow-sm active:scale-95 transition-all">
                      <span>⬇️ Download ▾</span>
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl hidden group-hover:block z-50 py-1.5 min-w-[125px] text-xs font-bold text-slate-700 dark:text-slate-200">
                      <button onClick={() => downloadExcelData(gstItems.filter(i => i.gstin !== "—"), "GSTR1_B2B_Report")} className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">B2B Report</button>
                      <button onClick={() => downloadExcelData(gstItems.filter(i => i.gstin === "—"), "GSTR1_B2C_Report")} className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">B2C Report</button>
                      <button onClick={() => downloadExcelData(gstItems, "GSTR3B_Compiled_Ledger")} className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">For GSTR-3B</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-350 font-bold" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
                  <input type="date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-350 font-bold" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
                  <select value={reportLocation} onChange={(e) => setReportLocation(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-350 font-bold">
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="DAMANA">DAMANA</option>
                    <option value="KESURA">KESURA</option>
                    <option value="RAGHUNATHPUR">RAGHUNATHPUR</option>
                  </select>
                </div>
                <div className="flex items-end space-x-2">
                  <button onClick={() => triggerToast("Search executed", "success")} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] uppercase font-extrabold tracking-wider transition-all active:scale-95 shadow-sm">
                    🔍 Search
                  </button>
                  <button onClick={() => { setReportStartDate("2026-05-01"); setReportEndDate("2026-05-31"); setReportLocation("Bhubaneswar"); }} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 rounded-xl text-[10px] uppercase font-extrabold tracking-wider text-slate-700 dark:text-white transition-all active:scale-95">
                    🔄 Reset
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Invoice No</th>
                        <th className="py-4 px-5">Invoice Dt</th>
                        <th className="py-4 px-5">Customer Name</th>
                        <th className="py-4 px-5">GSTIN</th>
                        <th className="py-4 px-5">Subtotal</th>
                        <th className="py-4 px-5">Total Amount</th>
                        <th className="py-4 px-5">Insurance</th>
                        <th className="py-4 px-5">Discount</th>
                        <th className="py-4 px-5">Payable</th>
                        <th className="py-4 px-5">Total Paid</th>
                        <th className="py-4 px-5">Due Amt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {gstItems.map((item) => {
                        const isExpanded = expandedGstRowId === item.id;
                        return (
                          <React.Fragment key={item.id}>
                            <tr
                              onClick={() => setExpandedGstRowId(isExpanded ? null : item.id)}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors cursor-pointer"
                            >
                              <td className="py-3.5 px-5 font-bold text-indigo-650 dark:text-indigo-400 flex items-center space-x-1.5">
                                <span className="transform transition-transform text-[9px]">{isExpanded ? "▼" : "▶"}</span>
                                <span>{item.invoiceNo}</span>
                              </td>
                              <td className="py-3.5 px-5 font-semibold font-mono text-[10px] text-slate-400">{item.date}</td>
                              <td className="py-3.5 px-5 font-bold text-slate-850 dark:text-slate-200">{item.customer}</td>
                              <td className="py-3.5 px-5 font-mono text-slate-400">{item.gstin}</td>
                              <td className="py-3.5 px-5 font-bold">₹{item.subtotal}</td>
                              <td className="py-3.5 px-5 font-bold">₹{item.total}</td>
                              <td className="py-3.5 px-5 font-semibold text-slate-400">₹{item.insurance}</td>
                              <td className="py-3.5 px-5 font-semibold text-red-500">₹{item.discount}</td>
                              <td className="py-3.5 px-5 font-bold text-indigo-700 dark:text-indigo-300">₹{item.payable}</td>
                              <td className="py-3.5 px-5 font-bold text-green-600">₹{item.paid}</td>
                              <td className={`py-3.5 px-5 font-bold ${item.due > 0 ? "text-red-500" : "text-slate-400"}`}>₹{item.due}</td>
                            </tr>
                            {isExpanded && (
                              <tr>
                                <td colSpan={11} className="bg-slate-50/70 dark:bg-slate-900/40 p-4 border-l-2 border-indigo-500">
                                  <div className="overflow-x-auto">
                                    <h4 className="text-[10px] uppercase font-black text-indigo-500 mb-2 tracking-wider">HSN/SAC Itemized Breakdown</h4>
                                    <table className="w-full text-left text-[11px] min-w-[900px] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                                      <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                                          <th className="py-2.5 px-4">HSN/SAC</th>
                                          <th className="py-2.5 px-4">SAC Code</th>
                                          <th className="py-2.5 px-4">Qty</th>
                                          <th className="py-2.5 px-4">Taxable</th>
                                          <th className="py-2.5 px-4">CGST (2.5%)</th>
                                          <th className="py-2.5 px-4">SGST (2.5%)</th>
                                          <th className="py-2.5 px-4">CGST (9%)</th>
                                          <th className="py-2.5 px-4">SGST (9%)</th>
                                          <th className="py-2.5 px-4">IGST (18%)</th>
                                          <th className="py-2.5 px-4">CGST (14%)</th>
                                          <th className="py-2.5 px-4">SGST (14%)</th>
                                          <th className="py-2.5 px-4">Total Tax</th>
                                          <th className="py-2.5 px-4">Net Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                        <tr>
                                          <td className="py-2 px-4 font-bold text-slate-800 dark:text-slate-300">Spares</td>
                                          <td className="py-2 px-4 font-mono">8708</td>
                                          <td className="py-2 px-4">1</td>
                                          <td className="py-2 px-4">₹750</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">₹67.50</td>
                                          <td className="py-2 px-4">₹67.50</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">₹135</td>
                                          <td className="py-2 px-4 font-bold">₹885</td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 px-4 font-bold text-slate-800 dark:text-slate-300">Labour</td>
                                          <td className="py-2 px-4 font-mono">9987</td>
                                          <td className="py-2 px-4">1</td>
                                          <td className="py-2 px-4">₹450</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">₹40.50</td>
                                          <td className="py-2 px-4">₹40.50</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">—</td>
                                          <td className="py-2 px-4">₹81</td>
                                          <td className="py-2 px-4 font-bold">₹531</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                  <span>Displaying 3 GST ledger reports</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "By Insurance Claim": {
        const insRecords = [
          { id: "in1", type: "CASHLESS", invNo: "INV-2026-022", provider: "SBI GENERAL INSURANCE CO. LTD.", policy: "POL-998811", claimNo: "CLM-SBI-0012", customer: "Debasis Jena", vehicle: "OD-02-AX-1122", contact: "9876543210", arrival: "2026-05-10", total: 4800, taxSvc: 180, taxPart: 360, spares: 2000, labour: 1000, paidCust: 1000 },
          { id: "in2", type: "REIMBURSE", invNo: "INV-2026-025", provider: "HDFC General Insurance", policy: "POL-771122", claimNo: "CLM-HDFC-9081", customer: "Mamata Sahu", vehicle: "OD-33-Y-9988", contact: "9438123456", arrival: "2026-05-15", total: 6200, taxSvc: 270, taxPart: 450, spares: 2500, labour: 1500, paidCust: 2000 },
        ];

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Insurance Claims Ledger</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Total Cashless/Reimburse Invoices</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    By Insurance Claim
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button onClick={() => setShowReportsSummary(!showReportsSummary)} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-650 text-white rounded-xl text-[10px] uppercase font-extrabold shadow-sm transition-all active:scale-95">
                    {showReportsSummary ? "Hide Summary" : "Show Summary"}
                  </button>
                  <button onClick={() => downloadExcelData(insRecords, "Insurance_Claims_Ledger")} className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl text-[10px] uppercase font-extrabold shadow-sm transition-all active:scale-95">
                    Excel Export
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 shrink-0 font-bold text-xs">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Claim</label>
                  <select value={insuranceClaimFilter} onChange={(e) => setInsuranceClaimFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Jobcard Status</label>
                  <select value={insuranceStatusFilter} onChange={(e) => setInsuranceStatusFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option value="Both">Both</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Provider</label>
                  <select value={insuranceProviderFilter} onChange={(e) => setInsuranceProviderFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option value="All">All Providers</option>
                    <option value="SBI">SBI GENERAL</option>
                    <option value="HDFC">HDFC General</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                  <input type="date" className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                  <input type="date" className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Location</label>
                  <select className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option>Bhubaneswar</option>
                    <option>DAMANA</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => triggerToast("Report processed", "success")} className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-[10px] uppercase font-black tracking-wider transition-all active:scale-95 shadow-sm">
                    🔍 Search
                  </button>
                </div>
              </div>

              {/* Total Summary bar */}
              {showReportsSummary && (
                <div className="bg-slate-850 text-white dark:bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl shadow-md grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0 font-bold font-sans">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block mb-0.5">Total Claim Amount</span>
                    <span className="text-sm font-black text-green-400">₹11,000.00</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block mb-0.5">Taxes on Parts / Services</span>
                    <span className="text-sm font-black text-indigo-300">₹1,260.00</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block mb-0.5">Spares & Labour Totals</span>
                    <span className="text-sm font-black">₹7,000.00</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block mb-0.5">Approved Claims Count</span>
                    <span className="text-sm font-black text-teal-400">2 Accounts</span>
                  </div>
                </div>
              )}

              {/* Grid Grid */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Bill Type</th>
                        <th className="py-4 px-5">Invoice No</th>
                        <th className="py-4 px-5">Insurance Provider (Policy)</th>
                        <th className="py-4 px-5">Claim Number</th>
                        <th className="py-4 px-5">Customer Name</th>
                        <th className="py-4 px-5">Vehicle No</th>
                        <th className="py-4 px-5">Contact</th>
                        <th className="py-4 px-5">Arrival Date</th>
                        <th className="py-4 px-5">Total Amount</th>
                        <th className="py-4 px-5">Tax On Svc</th>
                        <th className="py-4 px-5">Tax On Parts</th>
                        <th className="py-4 px-5">Spares</th>
                        <th className="py-4 px-5">Labour Charge</th>
                        <th className="py-4 px-5">Paid Cust</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {insRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3 px-5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              rec.type === "CASHLESS" ? "bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400" : "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                            }`}>
                              {rec.type}
                            </span>
                          </td>
                          <td className="py-3 px-5 font-bold text-indigo-650 dark:text-indigo-400">{rec.invNo}</td>
                          <td className="py-3 px-5">{rec.provider} <span className="text-[10px] text-slate-400 block font-mono font-medium">{rec.policy}</span></td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-500">{rec.claimNo}</td>
                          <td className="py-3 px-5 font-bold text-slate-800 dark:text-white">{rec.customer}</td>
                          <td className="py-3 px-5 font-mono text-slate-700 dark:text-slate-300 font-bold">{rec.vehicle}</td>
                          <td className="py-3 px-5 font-medium">{rec.contact}</td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{rec.arrival}</td>
                          <td className="py-3 px-5 font-bold">₹{rec.total}</td>
                          <td className="py-3 px-5 font-medium">₹{rec.taxSvc}</td>
                          <td className="py-3 px-5 font-medium">₹{rec.taxPart}</td>
                          <td className="py-3 px-5">₹{rec.spares}</td>
                          <td className="py-3 px-5">₹{rec.labour}</td>
                          <td className="py-3 px-5 font-bold text-green-600">₹{rec.paidCust}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                  <span>Displaying 2 claims records</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "Report By Invoices": {
        const filteredInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.date);
          const start = new Date(reportStartDate);
          const end = new Date(reportEndDate);
          const dateMatch = invDate >= start && invDate <= end;
          
          if (reportInvoiceType === "By Counter Sales") {
            return dateMatch && inv.type === "Counter Sales";
          }
          return dateMatch;
        });

        const invoiceRows = filteredInvoices.map(inv => ({
          id: inv.id,
          type: inv.type || "Services",
          jobCode: inv.jobCardNo,
          invNo: inv.invoiceNo,
          date: inv.date,
          customer: inv.customerName,
          vehicle: inv.vehicleNo,
          contact: inv.phone,
          arrival: inv.arrivalDate,
          spares: inv.subtotal, // We'd need further breakdown for true spares vs labour
          taxPart: inv.taxAmount, // Placeholder for parts tax
          labour: 0, // Placeholder
          taxSvc: 0, // Placeholder
          discount: inv.discountAmount,
          total: inv.totalAmount,
          paid: inv.paidAmount
        }));

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Audit Invoice Ledger</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Services and Counter Sales Invoices</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Report By Invoices
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      triggerToast("Compiling invoice PDF. Choose 'Save as PDF' in the destination dropdown!", "success");
                      setTimeout(() => window.print(), 600);
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[10px] uppercase font-extrabold shadow-sm transition-all active:scale-95"
                  >
                    🖨️ Print Bill
                  </button>
                  <button onClick={() => triggerToast("Dispatching SMS / Email invoices...", "success")} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] uppercase font-extrabold shadow-sm transition-all active:scale-95">
                    SMS / Email
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0 font-bold text-xs">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Report Type</label>
                  <select value={reportInvoiceType} onChange={(e) => setReportInvoiceType(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option value="By Services">By Services</option>
                    <option value="By Counter Sales">By Counter Sales</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Jobcard Status</label>
                  <select className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option>Both</option>
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Location</label>
                  <select className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option>Bhubaneswar</option>
                    <option>DAMANA</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => triggerToast("Invoices query complete", "success")} className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-[10px] uppercase font-black tracking-wider transition-all active:scale-95 shadow-sm">
                    🔍 Search
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5 w-12 text-center">Type</th>
                        <th className="py-4 px-5">Job/POS Id</th>
                        <th className="py-4 px-5">Invoice No (Dt)</th>
                        <th className="py-4 px-5">Customer Name</th>
                        <th className="py-4 px-5">Vehicle No / POS Name</th>
                        <th className="py-4 px-5">Contact</th>
                        <th className="py-4 px-5">Arrival Date</th>
                        <th className="py-4 px-5">Spares</th>
                        <th className="py-4 px-5">Tax On Parts</th>
                        <th className="py-4 px-5">Labour Charge</th>
                        <th className="py-4 px-5">Tax On Svc</th>
                        <th className="py-4 px-5">Discount</th>
                        <th className="py-4 px-5">Total Amount</th>
                        <th className="py-4 px-5">Paid (Cust)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {invoiceRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3 px-5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              row.type === "Services" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}>
                              {row.type}
                            </span>
                          </td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-500">{row.jobCode}</td>
                          <td className="py-3 px-5 font-bold text-indigo-650 dark:text-indigo-400">{row.invNo} <span className="text-[9px] font-mono text-slate-400 block font-normal">{row.date}</span></td>
                          <td className="py-3 px-5 font-bold text-slate-800 dark:text-white">{row.customer}</td>
                          <td className="py-3 px-5">{row.vehicle}</td>
                          <td className="py-3 px-5 font-medium">{row.contact}</td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{row.arrival}</td>
                          <td className="py-3 px-5">₹{row.spares}</td>
                          <td className="py-3 px-5 text-slate-400">₹{row.taxPart}</td>
                          <td className="py-3 px-5">₹{row.labour}</td>
                          <td className="py-3 px-5 text-slate-400">₹{row.taxSvc}</td>
                          <td className="py-3 px-5 text-red-500">₹{row.discount}</td>
                          <td className="py-3 px-5 font-bold text-indigo-700 dark:text-indigo-300">₹{row.total}</td>
                          <td className="py-3 px-5 font-bold text-green-600">₹{row.paid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                  <span>Displaying 2 ledger invoices</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "Spares Transfer": {
        const transferLogs = [
          { id: "tr1", code: "ST-0012", part: "BOSCH Spark Plug", qty: 20, from: "DAMANA", to: "RAGHUNATHPUR", date: "2026-05-25", status: "Transferred", user: "Manoj Kumar" },
          { id: "tr2", code: "ST-0013", part: "Chain Lube Aerosol", qty: 15, from: "Bhubaneswar", to: "DAMANA", date: "2026-05-28", status: "Transferred", user: "Subhashis Sen" },
        ];

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Internal Logistics</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Inter-branch Spares Replenishments</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Spares Transfer Log
                  </h2>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0 font-bold text-xs">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">From Location</label>
                  <select value={sparesFromLoc} onChange={(e) => setSparesFromLoc(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="DAMANA">DAMANA</option>
                    <option value="KESURA">KESURA</option>
                    <option value="RAGHUNATHPUR">RAGHUNATHPUR</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">To Location</label>
                  <select value={sparesToLoc} onChange={(e) => setSparesToLoc(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="DAMANA">DAMANA</option>
                    <option value="KESURA">KESURA</option>
                    <option value="RAGHUNATHPUR">RAGHUNATHPUR</option>
                  </select>
                </div>
                <div className="flex flex-col col-span-2 sm:col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Start / End Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]" />
                    <input type="date" className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button onClick={() => triggerToast("Transfer query executed", "success")} className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-[10px] uppercase font-black tracking-wider transition-all active:scale-95 shadow-sm">
                    🔍 Query Transfers
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Transfer ID</th>
                        <th className="py-4 px-5">Spare Item</th>
                        <th className="py-4 px-5">Qty</th>
                        <th className="py-4 px-5">From Garage</th>
                        <th className="py-4 px-5">To Garage</th>
                        <th className="py-4 px-5">Logged Date</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Logged By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {transferLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3 px-5 font-mono text-[10px] text-indigo-650 dark:text-indigo-400 font-bold">{log.code}</td>
                          <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-200">{log.part}</td>
                          <td className="py-3 px-5 font-bold">{log.qty} Units</td>
                          <td className="py-3 px-5">{log.from}</td>
                          <td className="py-3 px-5">{log.to}</td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{log.date}</td>
                          <td className="py-3 px-5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-slate-400">{log.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ==========================================
      // SECTION B — SYSTEM CONFIGURATION
      // ==========================================
      case "Brandwise Consumables":
        return renderGenericCrudGrid(
          "Brandwise Consumables",
          brandwiseConsumables,
          setBrandwiseConsumables,
          [
            { key: "brand", label: "Brand" },
            { key: "name", label: "Consumable Name" },
            { key: "code", label: "Category Code" }
          ]
        );

      case "Consumable Brands":
        return renderGenericCrudGrid(
          "Consumable Brands Info",
          consumableBrandsList,
          setConsumableBrandsList,
          [{ key: "name", label: "Consumables Brand Name" }]
        );

      case "Customer Source":
        return renderGenericCrudGrid(
          "Customer Source Profiles",
          customerSourcesList,
          setCustomerSourcesList,
          [
            { key: "company", label: "Company Name" },
            { key: "gstin", label: "GST Number" },
            { key: "email", label: "Email ID" },
            { key: "contact", label: "Contact No" },
            { key: "person", label: "Contact Person" },
            { key: "address", label: "Address" },
            { key: "city", label: "City" },
            { key: "state", label: "State" },
            { key: "sms", label: "SMS Reminders" },
            { key: "date", label: "Register Date" }
          ]
        );

      case "Insurance Provider":
        return renderGenericCrudGrid(
          "Insurance Provider Registry",
          insuranceProvidersList,
          setInsuranceProvidersList,
          [
            { key: "name", label: "Insurance Provider Name" },
            { key: "gstin", label: "GST Number" },
            { key: "address", label: "Address" },
            { key: "contact", label: "Contact Number" },
            { key: "email", label: "Email ID" }
          ]
        );

      case "Spares Master":
        return renderGenericCrudGrid(
          "Spares Master List",
          sparesMasterList,
          setSparesMasterList,
          [
            { key: "name", label: "Parts Name" },
            { key: "code", label: "Category Code" }
          ]
        );

      case "Vehicle Category":
        return renderGenericCrudGrid(
          "Vehicle Category Directory",
          vehicleCategoriesList,
          setVehicleCategoriesList,
          [{ key: "name", label: "Vehicle Category Name" }]
        );

      case "Vehicle Models":
        return renderGenericCrudGrid(
          "Vehicle Models Directory",
          vehicleModelsList,
          setVehicleModelsList,
          [
            { key: "brand", label: "Vehicle Brand" },
            { key: "model", label: "Vehicle Model" },
            { key: "variant", label: "Vehicle Variant" }
          ]
        );

      case "Workshop Info":
        return renderGenericCrudGrid(
          "Workshop Branches Info",
          workshopBranches,
          setWorkshopBranches,
          [
            { key: "id", label: "Workshop ID" },
            { key: "name", label: "Workshop Name" },
            { key: "location", label: "Location" },
            { key: "pin", label: "Pincode" },
            { key: "city", label: "City" },
            { key: "person", label: "Contact Person" },
            { key: "contact", label: "Contact No" },
            { key: "email", label: "Email ID" }
          ],
          false, // Workshop Info cannot add new branches inline
          false  // Workshop Info cannot delete inline
        );

      case "View Logs": {
        const q = crudFormSearchQuery.toLowerCase();
        const filteredLogs = auditLogsList.filter((log) => {
          return Object.values(log).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          );
        });

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Audit Trail Log</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Real-time operations audits</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    View System Logs
                  </h2>
                </div>
                
                <div>
                  <button onClick={() => downloadExcelData(filteredLogs, "System_Audit_Logs")} className="px-3.5 py-2.5 bg-indigo-660 hover:bg-indigo-760 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl text-[10px] uppercase font-black tracking-wider shadow-sm active:scale-95 transition-all">
                    Excel Export
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 font-bold text-xs">
                <div className="flex flex-col col-span-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Search Logs</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={crudFormSearchQuery}
                      onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                      placeholder="Real-time search across log entries..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 font-semibold"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Filter By Category</label>
                  <select className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <option>All Audits</option>
                    <option>Vehicle Service</option>
                    <option>Vendor & Purchases</option>
                    <option>Inventory</option>
                  </select>
                </div>
              </div>

              {/* Log Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5 w-24">Log ID</th>
                        <th className="py-4 px-5">Description</th>
                        <th className="py-4 px-5 w-40 text-center">Type</th>
                        <th className="py-4 px-5">Category</th>
                        <th className="py-4 px-5">Changed By</th>
                        <th className="py-4 px-5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{log.id}</td>
                          <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-200">{log.desc}</td>
                          <td className="py-3 px-5 text-center">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100/10">
                              {log.type}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-slate-500">{log.category}</td>
                          <td className="py-3 px-5 font-bold">{log.user}</td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-450">{log.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ==========================================
      // SECTION C — MANAGE WORKSHOP
      // ==========================================
      case "Inventory Management": {
        const q = crudFormSearchQuery.toLowerCase();
        const filteredStock = inventoryStockSummary.filter((item) => {
          return Object.values(item).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          );
        });

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Store Ledger</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Real-time Parts Valuations</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Stock Summary
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button onClick={() => triggerToast("Directing to PO manager...", "info")} className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-[10px] uppercase font-extrabold shadow-sm active:scale-95 transition-all">
                    <span>🛒 Manage Purchase</span>
                  </button>
                  <button onClick={() => setInventoryThresholdMode(!inventoryThresholdMode)} className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-[10px] uppercase font-extrabold shadow-sm active:scale-95 transition-all">
                    <span>Update Threshold Limit</span>
                  </button>
                </div>
              </div>

              {/* Threshold Configuration bar */}
              {inventoryThresholdMode && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-indigo-500/30 shadow-md shrink-0 flex items-center justify-between font-bold text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-800 dark:text-white">Minimum Stock Threshold Level:</span>
                    <input type="number" defaultValue="40" className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg text-center" />
                  </div>
                  <button onClick={() => { setInventoryThresholdMode(false); triggerToast("Global store thresholds updated", "success"); }} className="px-3.5 py-1.5 bg-green-500 hover:bg-green-600 text-slate-900 rounded-lg text-[10px] uppercase tracking-wider font-extrabold">Save Limits</button>
                </div>
              )}

              {/* Search bar */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={crudFormSearchQuery}
                    onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                    placeholder="Search stock by spare name, brand, or model..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 font-semibold"
                  />
                </div>
              </div>

              {/* Stock Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Spare Name</th>
                        <th className="py-4 px-5">Vehicle Brand</th>
                        <th className="py-4 px-5">Vehicle Model</th>
                        <th className="py-4 px-5">Vehicle Variant</th>
                        <th className="py-4 px-5">Part Brand</th>
                        <th className="py-4 px-5">Part #</th>
                        <th className="py-4 px-5 text-center">Total Qty</th>
                        <th className="py-4 px-5 text-center">Consumed</th>
                        <th className="py-4 px-5 text-center">Available</th>
                        <th className="py-4 px-5 text-center">Estimated</th>
                        <th className="py-4 px-5">Bin Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredStock.map((row) => {
                        const isCritical = row.availableQty < 40;
                        return (
                          <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                            <td className="py-3.5 px-5 font-bold text-slate-850 dark:text-slate-200">{row.spareName}</td>
                            <td className="py-3.5 px-5">{row.brand}</td>
                            <td className="py-3.5 px-5 font-bold text-indigo-650">{row.model}</td>
                            <td className="py-3.5 px-5"><span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[9px] font-bold uppercase">{row.variant}</span></td>
                            <td className="py-3.5 px-5">{row.partBrand}</td>
                            <td className="py-3.5 px-5 font-mono text-slate-450">{row.partNo}</td>
                            <td className="py-3.5 px-5 text-center">{row.totalQty}</td>
                            <td className="py-3.5 px-5 text-center text-slate-400">{row.consumedQty}</td>
                            <td className="py-3.5 px-5 text-center font-black">
                              <span className={`px-2 py-0.5 rounded-lg ${
                                isCritical ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200" : "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                              }`}>
                                {row.availableQty}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono text-slate-450">{row.estimatedQty}</td>
                            <td className="py-3.5 px-5"><span className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] font-bold font-mono">{row.location}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "Manage Packages": {
        const q = crudFormSearchQuery.toLowerCase();
        const filteredPkgs = packagesList.filter((pkg) => {
          return Object.values(pkg).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          );
        });

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Bundled Workshop Offers</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Package Management Workspace</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Manage Service Packages
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button onClick={() => triggerToast("Add package form pending schema configuration", "info")} className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Package</span>
                  </button>
                </div>
              </div>

              {/* Packages Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Reference ID</th>
                        <th className="py-4 px-5">Package Name</th>
                        <th className="py-4 px-5">Package Type</th>
                        <th className="py-4 px-5">Price (Excl. Tax)</th>
                        <th className="py-4 px-5">Coverage Name</th>
                        <th className="py-4 px-5">Created By</th>
                        <th className="py-4 px-5 font-mono text-[10px] text-slate-450">Created On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredPkgs.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[10px] text-indigo-650 dark:text-indigo-400 font-bold">{pkg.refId}</td>
                          <td className="py-3.5 px-5 font-bold text-slate-850 dark:text-slate-200 leading-snug">{pkg.name}</td>
                          <td className="py-3.5 px-5 text-slate-500">{pkg.type}</td>
                          <td className="py-3.5 px-5 font-bold text-indigo-700 dark:text-indigo-300">₹{pkg.price}</td>
                          <td className="py-3.5 px-5"><span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/20 text-purple-750 dark:text-purple-400 text-[9px] font-black uppercase">{pkg.coverage}</span></td>
                          <td className="py-3.5 px-5 font-bold">{pkg.user}</td>
                          <td className="py-3.5 px-5 font-mono text-[10px] text-slate-450">{pkg.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "Manage Services":
        return renderGenericCrudGrid(
          "Workshop Mechanical & Paint Services",
          servicesList,
          setServicesList,
          [
            { key: "name", label: "Service Name" },
            { key: "category", label: "Vehicle Category" },
            { key: "code", label: "Category Code" },
            { key: "amount", label: "Amount", cell: (v) => <span className="font-bold text-indigo-700 dark:text-indigo-300">₹{v}</span> }
          ]
        );

      case "View Deleted Records": {
        const q = crudFormSearchQuery.toLowerCase();
        const filteredDel = deletedRecordsList.filter((log) => {
          return Object.values(log).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          );
        });

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Recycle Bin Registry</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>View and Restore Cancelled Job Cards</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Deleted Records Ledger
                  </h2>
                </div>
              </div>

              {/* Deleted list */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5 w-16 text-center">Restore</th>
                        <th className="py-4 px-5">Cancellation Date</th>
                        <th className="py-4 px-5">Vehicle Name</th>
                        <th className="py-4 px-5">Plate Number</th>
                        <th className="py-4 px-5">Customer Name</th>
                        <th className="py-4 px-5">Mobile</th>
                        <th className="py-4 px-5 font-mono text-[10px] text-slate-450">Invoice Ref</th>
                        <th className="py-4 px-5">Technician</th>
                        <th className="py-4 px-5">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredDel.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3.5 px-5 text-center">
                            <button
                              onClick={() => {
                                if (confirm("Do you want to restore this Job Card back to the active queue?")) {
                                  // Restore logic
                                  setDeletedRecordsList(deletedRecordsList.filter((item) => item.id !== row.id));
                                  triggerToast("Job Card restored successfully back to Queue", "success");
                                }
                              }}
                              className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                              title="Restore Record"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-[10px] text-slate-400">{row.date}</td>
                          <td className="py-3.5 px-5 font-bold text-slate-850 dark:text-slate-200">{row.vehicle}</td>
                          <td className="py-3.5 px-5 font-bold font-mono text-slate-700 dark:text-slate-300">{row.plateNo}</td>
                          <td className="py-3.5 px-5 font-bold text-slate-850 dark:text-slate-200">{row.name}</td>
                          <td className="py-3.5 px-5">{row.mobile}</td>
                          <td className="py-3.5 px-5 font-mono text-[10px] text-slate-450">{row.invoice}</td>
                          <td className="py-3.5 px-5">{row.tech}</td>
                          <td className="py-3.5 px-5"><span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-[9px] text-indigo-700 dark:text-indigo-400 uppercase font-black">{row.source}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "View Service History": {
        const q = crudFormSearchQuery.toLowerCase();
        const filteredHistory = deletedRecordsList.filter((item) => {
          return Object.values(item).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          );
        });

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Archived Worksheets</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>View Customer Service History Cards</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Service History
                  </h2>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={crudFormSearchQuery}
                    onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                    placeholder="Search past services by plate number, customer name, or technician..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 font-semibold"
                  />
                </div>
              </div>

              {/* Cards Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {filteredHistory.map((rec) => (
                  <div key={rec.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-lg bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 font-mono text-[10px] font-black uppercase">{rec.plateNo}</span>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white mt-1 uppercase">{rec.vehicle}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{rec.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] border-y border-slate-100 dark:border-slate-800/80 py-3 text-slate-500">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Customer Name</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{rec.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Contact Phone</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{rec.mobile}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Odometer KMS</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{rec.kms} Kms</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Allocated Mechanic</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{rec.tech}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Billing Invoice</span>
                        <span className="font-bold text-indigo-650 dark:text-indigo-400 font-mono">{rec.invoice}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button onClick={() => triggerToast(`Displaying full log details for ${rec.plateNo}`, "info")} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-[9px] font-black uppercase">View More</button>
                        <button
                          onClick={() => {
                            triggerToast(`Preparing PDF log ticket for ${rec.plateNo}. Please select 'Save as PDF' inside the destination menu!`, "success");
                            setTimeout(() => window.print(), 600);
                          }}
                          className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-[9px] font-black uppercase"
                        >
                          Invoice 🖨️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case "View Technician Productivity": {
        const q = crudFormSearchQuery.toLowerCase();
        const filteredTech = techProductivityList.filter((log) => {
          return Object.values(log).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          );
        });

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Performance Analytics</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Technician Clockings & Labour Margins</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Technician Productivity
                  </h2>
                </div>
                
                <div>
                  <button onClick={() => downloadExcelData(filteredTech, "Technician_Productivity_Report")} className="px-3.5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl text-[10px] uppercase font-black tracking-wider shadow-sm active:scale-95 transition-all">
                    Excel Export
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={crudFormSearchQuery}
                    onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                    placeholder="Search by job ID, vehicle plate, technician, or service name..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 font-semibold"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Job ID</th>
                        <th className="py-4 px-5">Vehicle</th>
                        <th className="py-4 px-5">Technician Name</th>
                        <th className="py-4 px-5">Service Name</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Start Time</th>
                        <th className="py-4 px-5">Stop Time</th>
                        <th className="py-4 px-5">Time Taken</th>
                        <th className="py-4 px-5">Tech Cost</th>
                        <th className="py-4 px-5">Profit Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredTech.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{row.jobId}</td>
                          <td className="py-3 px-5 font-bold font-mono text-slate-700 dark:text-slate-200">{row.vehicle}</td>
                          <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-100">{row.name}</td>
                          <td className="py-3 px-5 text-indigo-650">{row.service}</td>
                          <td className="py-3 px-5">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-5 font-mono text-slate-450">{row.start}</td>
                          <td className="py-3 px-5 font-mono text-slate-450">{row.stop}</td>
                          <td className="py-3 px-5 font-bold text-slate-800 dark:text-slate-200">{row.duration}</td>
                          <td className="py-3 px-5">₹{row.cost}</td>
                          <td className="py-3 px-5 font-bold text-green-600">₹{row.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };
  const renderCoreBusinessTabs = () => {
    switch (activeTab) {
      case "Dashboard": {
        const activities = [
          { id: 1, text: "Manoj Kumar started servicing OD-05-AB-1234", time: "10 mins ago", type: "service" },
          { id: 2, text: "WhatsApp invoice generated for Priya Sharma (OD-02-XY-9876)", time: "25 mins ago", type: "invoice" },
          { id: 3, text: "Stock depletion warning: Front Brake Shoe Assembly < 20 units", time: "1 hr ago", type: "stock" },
          { id: 4, text: "Customer Debasis Jena rated service 5-stars ⭐", time: "3 hrs ago", type: "feedback" },
        ];

        return (
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 font-sans w-full">
            {/* Header */}
            <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
              <span>Enterprise WMS Overview</span>
              <span className="h-1 w-1 rounded-full bg-slate-350" />
              <span>Active Tenant Ledger</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide">
              Workshop Dashboard
            </h2>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl">
                  <Sliders className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active Queue</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{stats.underServicing + stats.ready} Vehicles</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Today&apos;s Revenue</span>
                  <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">₹34,250.00</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Completed Today</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{stats.completed} Jobs</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Pending Dues</span>
                  <span className="text-sm font-black text-red-500">₹12,500.00</span>
                </div>
              </div>
            </div>

            {/* Layout Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Workshop Feed */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Live Workshop Log</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.map((act) => (
                    <div key={act.id} className="py-3 flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-lg mt-0.5 ${
                          act.type === "service" ? "bg-blue-50 text-blue-600 dark:bg-blue-950" :
                          act.type === "invoice" ? "bg-green-50 text-green-600 dark:bg-green-950" :
                          act.type === "stock" ? "bg-red-50 text-red-500 dark:bg-red-950" :
                          "bg-purple-50 text-purple-600 dark:bg-purple-950"
                        }`}>
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug">{act.text}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono shrink-0 mt-0.5">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Operation Alerts</h3>
                <div className="space-y-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center space-x-3">
                    <Info className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>4 Customer Follow-ups due for advisor dispatch.</span>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl flex items-center space-x-3">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>3 Inventory items depletion below re-order limit.</span>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-2xl flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span>All standard daily system ledger clean backup done.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "BI Analytics": {
        return (
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 font-sans w-full">
            {/* Header */}
            <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
              <span>Business Intelligence Board</span>
              <span className="h-1 w-1 rounded-full bg-slate-350" />
              <span>Spec 2 Analytic Graphs</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide">
              BI Analysis Graphs
            </h2>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm font-sans">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Gross Margin</span>
                <span className="text-lg font-black text-slate-850 dark:text-white mt-1 block">₹2,84,500.00</span>
                <span className="text-[10px] font-bold text-green-500 mt-0.5 block">▲ +14% Month-on-Month</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm font-sans">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Average Ticket Size</span>
                <span className="text-lg font-black text-slate-850 dark:text-white mt-1 block">₹1,846.50</span>
                <span className="text-[10px] font-bold text-indigo-500 mt-0.5 block">▲ Steady service value</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm font-sans">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Parts vs Labor Share</span>
                <span className="text-lg font-black text-slate-850 dark:text-white mt-1 block">62% / 38%</span>
                <span className="text-[10px] font-bold text-teal-500 mt-0.5 block">● Healthy parts stock yield</span>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Graph 1: Revenue line graph */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Revenue Trend (Weekly)</h3>
                  <span className="text-[10px] font-black text-green-500">₹32,000 Peak</span>
                </div>
                {/* SVG Rendered Premium Interactive Line Graph */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                  <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible font-semibold text-[8px] fill-slate-400">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />
                    <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(148, 163, 184, 0.2)" />

                    {/* Gradient Fill under the Line */}
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 40 170 L 40 130 L 110 100 L 185 120 L 260 70 L 335 80 L 410 40 L 480 55 L 480 170 Z" fill="url(#lineGrad)" />

                    {/* Graph Line */}
                    <path
                      d="M 40 130 L 110 100 L 185 120 L 260 70 L 335 80 L 410 40 L 480 55"
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Pulsing Highlight Dot on Peak */}
                    <circle cx="410" cy="40" r="5.5" fill="rgb(34, 197, 94)" stroke="white" strokeWidth="1.5" className="animate-pulse" />

                    {/* Y Axis Labels */}
                    <text x="10" y="23">₹40k</text>
                    <text x="10" y="63">₹30k</text>
                    <text x="10" y="103">₹20k</text>
                    <text x="10" y="143">₹10k</text>
                    <text x="15" y="173">0</text>

                    {/* X Axis Labels */}
                    <text x="40" y="188" textAnchor="middle">Mon</text>
                    <text x="110" y="188" textAnchor="middle">Tue</text>
                    <text x="185" y="188" textAnchor="middle">Wed</text>
                    <text x="260" y="188" textAnchor="middle">Thu</text>
                    <text x="335" y="188" textAnchor="middle">Fri</text>
                    <text x="410" y="188" textAnchor="middle">Sat</text>
                    <text x="480" y="188" textAnchor="middle">Sun</text>
                  </svg>
                </div>
              </div>

              {/* Graph 2: Brand comparison bar chart */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Revenue by Brand</h3>
                  <span className="text-[10px] font-black text-indigo-500">Honda Leading</span>
                </div>
                {/* SVG Rendered Premium Bar Chart */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                  <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible font-semibold text-[8px] fill-slate-400">
                    <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(148, 163, 184, 0.2)" />

                    {/* Bars for Suzuki */}
                    <rect x="70" y="80" width="30" height="90" rx="4" fill="rgba(99, 102, 241, 0.85)" className="hover:fill-indigo-600 transition-colors" />
                    <text x="85" y="72" textAnchor="middle" className="font-bold fill-slate-700 dark:fill-slate-300">₹90k</text>
                    <text x="85" y="185" textAnchor="middle">Suzuki</text>

                    {/* Bars for Honda */}
                    <rect x="155" y="40" width="30" height="130" rx="4" fill="rgba(99, 102, 241, 0.85)" className="hover:fill-indigo-600 transition-colors" />
                    <text x="170" y="32" textAnchor="middle" className="font-bold fill-slate-700 dark:fill-slate-300">₹130k</text>
                    <text x="170" y="185" textAnchor="middle">Honda</text>

                    {/* Bars for TVS */}
                    <rect x="240" y="65" width="30" height="105" rx="4" fill="rgba(99, 102, 241, 0.85)" className="hover:fill-indigo-600 transition-colors" />
                    <text x="255" y="57" textAnchor="middle" className="font-bold fill-slate-700 dark:fill-slate-300">₹105k</text>
                    <text x="255" y="185" textAnchor="middle">TVS</text>

                    {/* Bars for KTM */}
                    <rect x="325" y="110" width="30" height="60" rx="4" fill="rgba(99, 102, 241, 0.85)" className="hover:fill-indigo-600 transition-colors" />
                    <text x="340" y="102" textAnchor="middle" className="font-bold fill-slate-700 dark:fill-slate-300">₹60k</text>
                    <text x="340" y="185" textAnchor="middle">KTM</text>

                    {/* Bars for Harley */}
                    <rect x="410" y="125" width="30" height="45" rx="4" fill="rgba(99, 102, 241, 0.85)" className="hover:fill-indigo-600 transition-colors" />
                    <text x="425" y="117" textAnchor="middle" className="font-bold fill-slate-700 dark:fill-slate-300">₹45k</text>
                    <text x="425" y="185" textAnchor="middle">Harley</text>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        );
      }

      case "CRM":
      case "Customers": {
        const mockCustList = [
          { id: "C-098", name: "Debasis Jena", phone: "9853312345", email: "debasis.jena@yahoo.com", joined: "12 Jan 2026", lastVehicle: "TVS Apache (OD-02-X-4422)", spent: 4850, visits: 3, rating: 5 },
          { id: "C-099", name: "Mamata Sahu", phone: "9438123456", email: "mamata@gmail.com", joined: "18 Feb 2026", lastVehicle: "Suzuki Access (OD-33-A-1100)", spent: 2300, visits: 2, rating: 4 },
          { id: "C-100", name: "Aditya Pradhan", phone: "9876543210", email: "aditya@bikemaster.com", joined: "05 May 2026", lastVehicle: "Honda Activa (OD-05-AB-1234)", spent: 1450, visits: 1, rating: 5 },
        ];

        const q = crudFormSearchQuery.toLowerCase();
        const filteredCust = mockCustList.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>WMS Roster CRM</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Customer Database and Profiles</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Customer Directory
                  </h2>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={crudFormSearchQuery}
                    onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                    placeholder="Search customers by name or contact number..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 font-semibold"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">ID</th>
                        <th className="py-4 px-5">Name</th>
                        <th className="py-4 px-5">Phone</th>
                        <th className="py-4 px-5">Email ID</th>
                        <th className="py-4 px-5">Registered Date</th>
                        <th className="py-4 px-5">Last Serviced Vehicle</th>
                        <th className="py-4 px-5 text-center">Services</th>
                        <th className="py-4 px-5">Revenue Generated</th>
                        <th className="py-4 px-5 text-center">Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredCust.map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[10px] text-slate-400 font-bold">{cust.id}</td>
                          <td className="py-3.5 px-5 font-bold text-slate-850 dark:text-slate-200">{cust.name}</td>
                          <td className="py-3.5 px-5">{cust.phone}</td>
                          <td className="py-3.5 px-5 text-slate-450 dark:text-slate-500 font-medium">{cust.email}</td>
                          <td className="py-3.5 px-5 font-mono text-[10px] text-slate-400">{cust.joined}</td>
                          <td className="py-3.5 px-5 text-indigo-650">{cust.lastVehicle}</td>
                          <td className="py-3.5 px-5 text-center font-bold">{cust.visits} visit(s)</td>
                          <td className="py-3.5 px-5 font-bold text-green-600">₹{cust.spent}</td>
                          <td className="py-3.5 px-5 text-center text-amber-500 font-bold">
                            {"⭐".repeat(cust.rating)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "Payments": {
        const paymentList = [
          { id: "inv-9081", invoice: "INV-2026-041", date: "28/05/2026", customer: "Debasis Jena", total: 1416, paid: 1416, due: 0, method: "UPI" },
          { id: "inv-9082", invoice: "INV-2026-042", date: "27/05/2026", customer: "Mamata Sahu", total: 1003, paid: 503, due: 500, method: "Split Payment" },
          { id: "inv-9083", invoice: "INV-2026-043", date: "26/05/2026", customer: "Priyabrata Das", total: 2832, paid: 2000, due: 832, method: "Cash" },
        ];

        const q = crudFormSearchQuery.toLowerCase();
        const filteredPay = paymentList.filter(p => p.customer.toLowerCase().includes(q) || p.invoice.includes(q));

        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                    <span>Accounts Ledger</span>
                    <span className="h-1 w-1 rounded-full bg-slate-350" />
                    <span>Real-time Receivable entries</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                    Accounts Receivable
                  </h2>
                </div>
              </div>

              {/* Total Summary bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 shrink-0">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm font-sans">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Collected Dues</span>
                  <span className="text-sm font-black text-green-500 mt-1 block">₹3,919.00</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm font-sans">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Outstanding Customer Dues</span>
                  <span className="text-sm font-black text-red-500 mt-1 block">₹1,332.00</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm font-sans">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Dues Billed to Insurer</span>
                  <span className="text-sm font-black text-indigo-650 mt-1 block">₹500.00</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={crudFormSearchQuery}
                    onChange={(e) => setCrudFormSearchQuery(e.target.value)}
                    placeholder="Search invoices by invoice number or customer name..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 font-semibold"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-5">Invoice Reference</th>
                        <th className="py-4 px-5">Billed Date</th>
                        <th className="py-4 px-5">Customer Name</th>
                        <th className="py-4 px-5 font-mono text-[10px] text-slate-450">Billed Total</th>
                        <th className="py-4 px-5">Amount Collected</th>
                        <th className="py-4 px-5">Dues Amount</th>
                        <th className="py-4 px-5">Payment Method</th>
                        <th className="py-4 px-5 w-36 text-center">Manage Ledger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                      {filteredPay.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-3 px-5 font-mono text-[10px] text-indigo-650 dark:text-indigo-400 font-bold">{row.invoice}</td>
                          <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{row.date}</td>
                          <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-200">{row.customer}</td>
                          <td className="py-3 px-5 font-bold">₹{row.total}</td>
                          <td className="py-3 px-5 font-bold text-green-600">₹{row.paid}</td>
                          <td className={`py-3 px-5 font-bold ${row.due > 0 ? "text-red-500 animate-pulse" : "text-slate-400"}`}>₹{row.due}</td>
                          <td className="py-3 px-5"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[9px] uppercase font-black text-slate-500">{row.method}</span></td>
                          <td className="py-3 px-5 text-center">
                            {row.due > 0 ? (
                              <button
                                onClick={() => triggerToast(`Payment receipt of ₹${row.due} recorded for ${row.customer}!`, "success")}
                                className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-slate-900 font-black text-[9px] uppercase tracking-wide rounded-xl shadow-sm transition-all active:scale-95 duration-200"
                              >
                                Record Payment
                              </button>
                            ) : (
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-wider block">Fully Paid ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex font-sans ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`absolute top-5 right-5 z-30 p-2.5 rounded-xl border transition-all active:scale-95 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm"
          }`}
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* ── LEFT BRANDING PANEL ─────────────────────────────── */}
        <div className="hidden lg:flex flex-col w-[42%] bg-gradient-to-br from-green-700 via-emerald-600 to-teal-700 relative overflow-hidden p-12">
          {/* dot-grid texture */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
          {/* glow blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 flex items-center">
            <div className="bg-white p-2 rounded-2xl shadow-xl">
              <img 
                src="/assets/bike_master_logo.jpg" 
                alt="Bike Masters Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Hero text */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 mt-12">
            <div>
              <h2 className="text-white font-black text-4xl leading-tight tracking-tight">
                Enterprise<br />Workshop<br />Control.
              </h2>
              <p className="text-green-100/80 text-sm mt-4 leading-relaxed max-w-xs">
                Unified platform for job card management, technician allocation, inventory tracking, and financial reconciliation.
              </p>
            </div>

            {/* Live metric cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "247", label: "Jobs / Month" },
                { value: "₹4.2L", label: "Revenue" },
                { value: "98%", label: "Satisfaction" },
              ].map((m) => (
	                <div key={m.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
                  <p className="text-white text-2xl font-black">{m.value}</p>
                  <p className="text-green-200 text-[10px] font-bold mt-1 uppercase tracking-wide">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div className="space-y-2.5">
              {[
                { icon: <Sliders className="h-3.5 w-3.5" />, text: "Real-time Service Queue & Job Cards" },
                { icon: <TrendingUp className="h-3.5 w-3.5" />, text: "BI Analytics & Revenue Reports" },
                { icon: <CreditCard className="h-3.5 w-3.5" />, text: "Invoicing, Payments & Accounts" },
              ].map((f) => (
                <div key={f.text} className="flex items-center space-x-2.5 text-green-100/90">
                  <span className="bg-white/15 p-1.5 rounded-lg shrink-0">{f.icon}</span>
                  <span className="text-[11px] font-semibold">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center space-x-2 text-green-300/70 text-[10px] font-bold border-t border-white/10 pt-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
            <span>SYSTEM ONLINE</span>
            <span className="ml-auto opacity-60">v2.4.1</span>
          </div>
        </div>

        {/* ── RIGHT LOGIN PANEL ──────────────────────────────── */}
        <div className={`flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative ${theme === "dark" ? "bg-slate-950" : "bg-white"}`}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <img 
              src="/assets/bike_master_logo.jpg" 
              alt="Bike Masters Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>

	          <div className="w-full max-w-[360px] space-y-7">

            {/* Heading */}
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Welcome back</h2>
              <p className={`text-sm mt-1.5 font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                Sign in to your workspace to continue.
              </p>
            </div>

            {/* Role quick-select */}
            <div className="space-y-3">
              <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                Quick sign-in
              </p>
	              <div className="grid grid-cols-3 gap-2.5">
	                {([
	                  { label: "Manager",    username: "manager", password: "manager123", icon: Briefcase, ring: "ring-indigo-500", bg: theme === "dark" ? "bg-indigo-950/40 border-indigo-800/60 hover:bg-indigo-950/70" : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100", text: theme === "dark" ? "text-indigo-300" : "text-indigo-700" },
	                  { label: "Advisor",    username: "advisor", password: "advisor123", icon: FileText, ring: "ring-green-500",  bg: theme === "dark" ? "bg-green-950/40 border-green-800/60 hover:bg-green-950/70"   : "bg-green-50 border-green-200 hover:bg-green-100",   text: theme === "dark" ? "text-green-300"  : "text-green-700"  },
	                  { label: "Technician", username: "tech",    password: "tech123",    icon: Wrench, ring: "ring-amber-500",  bg: theme === "dark" ? "bg-amber-950/40 border-amber-800/60 hover:bg-amber-950/70"   : "bg-amber-50 border-amber-200 hover:bg-amber-100",   text: theme === "dark" ? "text-amber-300"  : "text-amber-700"  },
		                ] as const).map((r) => {
		                  const RoleIcon = r.icon;
		                  return (
		                    <button
		                      key={r.label}
		                      type="button"
		                      onClick={() => { setUsernameInput(r.username); setPasswordInput(r.password); }}
		                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border font-bold text-xs transition-all duration-150 active:scale-95 ${r.bg} ${r.text} ${usernameInput === r.username ? `ring-2 ${r.ring}` : ""}`}
		                    >
		                      <RoleIcon className="h-5 w-5" />
		                      <span className="text-[10px] font-black tracking-wide">{r.label}</span>
		                    </button>
		                  );
		                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className={`flex-1 h-px ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}>or enter manually</span>
              <div className={`flex-1 h-px ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Username</label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`} />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="username"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-700 focus:border-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`} />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-700 focus:border-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-extrabold text-sm tracking-wide shadow-lg shadow-green-600/25 hover:shadow-green-700/30 transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2"
              >
                Sign In
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>

            {/* Footer */}
            <p className={`text-center text-[10px] font-medium ${theme === "dark" ? "text-slate-700" : "text-slate-400"}`}>
              © BikeMaster 2026 &nbsp;·&nbsp; Powered by <span className={`font-bold ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}>LeOmm Labs</span>
            </p>
          </div>
        </div>

        {/* Toast */}
        <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-2xl shadow-xl flex items-start space-x-3.5 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto border ${
                toast.type === "success" ? "bg-green-600 text-white border-green-500 shadow-green-600/10" :
                toast.type === "warn"    ? "bg-red-500 text-white border-red-400 shadow-red-500/10" :
                "bg-slate-800 text-slate-100 border-slate-700 shadow-slate-900/20"
              }`}
            >
              {toast.type === "success" ? <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" /> : <Info className="h-5 w-5 mt-0.5 shrink-0" />}
              <div className="text-xs font-semibold flex-1 leading-relaxed">{toast.msg}</div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-white/70 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className={`${theme === "dark" ? "dark" : ""} h-screen overflow-hidden transition-colors duration-300 font-sans`}>
      {/* Container holding full page with theme support */}
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full flex flex-col overflow-hidden">
        
        {/* ============================================================ */}
        {/* 1. TOP NAV BAR */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 shadow-sm transition-colors duration-300">
          <div className="h-16 px-4 flex items-center justify-between">
            
            {/* Logo on Left */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileSidebarOpen(true);
                  } else {
                    setSidebarCollapsed(!sidebarCollapsed);
                  }
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all mr-1.5 active:scale-95"
                title="Toggle Sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div 
                className="flex items-center cursor-pointer active:scale-95 transition-transform"
                onClick={() => setActiveTab("Dashboard")}
              >
                <img 
                  src="/assets/bike_master_logo.jpg" 
                  alt="Bike Masters Logo" 
                  className="h-10 w-auto object-contain transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-700/50 text-xs font-semibold px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                <MapPin className="h-3 w-3 mr-1.5 text-green-500" />
                Bhubaneswar Branch
              </div>
            </div>

            {/* Top Navigation Options & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3.5">
              
              {/* Branch Selector Pill */}
              <div className="hidden lg:flex items-center space-x-1 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer">
                <span className="text-slate-600 dark:text-slate-300">Active Branch:</span>
                <span className="text-slate-900 dark:text-white font-semibold">BBR-001</span>
                <ChevronDown className="h-4 w-4 text-slate-500 ml-1" />
              </div>

              {/* Offers Selector Dropdown */}
              <div className="relative group hidden md:block">
                <button className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                  <Tag className="h-4 w-4 text-green-500" />
                  <span>OFFERS</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl ring-1 ring-black/5 focus:outline-none opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 border border-slate-200 dark:border-slate-700">
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">ACTIVE CAMPAIGNS</div>
                  <a href="#" className="flex flex-col p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">15% MONSOON OFF</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Valid on full chain & fork alignment</span>
                  </a>
                  <a href="#" className="flex flex-col p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">FREE WATER WASH</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Bundled with standard engine oil flush</span>
                  </a>
                </div>
              </div>

              {/* Shortcuts Selector Dropdown */}
              <div className="relative group hidden md:block">
                <button className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <span>SHORTCUTS</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 border border-slate-200 dark:border-slate-700">
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                    Register Customer
                  </button>
                  <button onClick={() => triggerToast("Navigated to Spares Purchase Page", "info")} className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                    Create Purchase Order
                  </button>
                  <button onClick={() => triggerToast("GSTR-1 report downloaded successfully!", "success")} className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                    Export GSTR-1 File
                  </button>
                </div>
              </div>

              {/* Light/Dark Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
              </button>

              {/* "NEW CUSTOMER REGISTRATION" Green Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-bold text-sm px-3 sm:px-4 py-2.5 rounded-xl shadow-md shadow-green-600/10 hover:shadow-green-700/20 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">NEW REGISTRATION</span>
              </button>


            </div>

          </div>
        </header>

        {/* ============================================================ */}
        {/* MONOREPO CONTENT GRID: Sidebar + Main Workspace */}
        {/* ============================================================ */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* ============================================================ */}
          {/* 2. LEFT SIDEBAR */}
          {/* ============================================================ */}
          {isMobileSidebarOpen && (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
            />
          )}

          <aside className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-all duration-300 flex flex-col h-screen md:h-full overflow-hidden shadow-2xl md:shadow-none shrink-0 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${sidebarCollapsed ? "w-72 md:w-16" : "w-72 md:w-64"}`}>
            <div className="md:hidden h-20 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center">
                <img 
                  src="/assets/bike_master_logo.jpg" 
                  alt="Bike Masters Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Sidebar Link Options */}
            <div className="flex-1 py-4 space-y-1 px-3 overflow-y-auto min-h-0">
              {[
                { name: "Dashboard", icon: Gauge, count: 0 },
                { name: "Service Queue", icon: Sliders, count: stats.all - stats.completed },
                { name: "BI Analytics", icon: TrendingUp, count: 0 },
                { name: "Customers", icon: User, count: 0 },
                { name: "Payments", icon: CreditCard, count: 0 },
                { name: "CRM", icon: Phone, count: 0 },

                // Expandable Groups
                {
                  name: "Business Reports",
                  icon: FileSpreadsheet,
                  isExpandable: true,
                  expandedState: isReportsExpanded,
                  setExpandedState: setIsReportsExpanded,
                  subItems: [
                    { name: "GST Filing Reports", icon: FileSpreadsheet },
                    { name: "By Insurance Claim", icon: ShieldAlert },
                    { name: "Report By Invoices", icon: FileText },
                    { name: "Spares Transfer", icon: Package }
                  ]
                },
                {
                  name: "Manage Users",
                  icon: Users,
                  isExpandable: true,
                  expandedState: isManageUsersExpanded,
                  setExpandedState: setIsManageUsersExpanded,
                  subItems: [
                    { name: "Manage Designation", icon: Briefcase },
                    { name: "Manage Employee", icon: Users }
                  ]
                },
                {
                  name: "Manage Workshop",
                  icon: Wrench,
                  isExpandable: true,
                  expandedState: isWorkshopExpanded,
                  setExpandedState: setIsWorkshopExpanded,
                  subItems: [
                    { name: "Inventory Management", icon: Package },
                    { name: "Manage Packages", icon: Package },
                    { name: "Manage Services", icon: Sliders },
                    { name: "View Deleted Records", icon: Trash2 },
                    { name: "View Service History", icon: Clock },
                    { name: "View Technician Productivity", icon: Sliders }
                  ]
                },
                {
                  name: "System Configuration",
                  icon: Sliders,
                  isExpandable: true,
                  expandedState: isConfigExpanded,
                  setExpandedState: setIsConfigExpanded,
                  subItems: [
                    { name: "Brandwise Consumables", icon: Sliders },
                    { name: "Consumable Brands", icon: Tag },
                    { name: "Customer Source", icon: User },
                    { name: "Insurance Provider", icon: ShieldAlert },
                    { name: "Spares Master", icon: Package },
                    { name: "Vehicle Category", icon: Sliders },
                    { name: "Vehicle Models", icon: Sliders },
                    { name: "Workshop Info", icon: Briefcase },
                    { name: "View Logs", icon: Clock }
                  ]
                }
              ].filter((item) => {
                // For expandable groups, show if ANY sub-item is accessible
                if (item.isExpandable) {
                  return item.subItems.some((s: { name: string }) => canAccessTab(s.name));
                }
                return canAccessTab(item.name);
              }).map((item) => {
                if (item.isExpandable) {
                  // Also filter sub-items themselves
                  item = { ...item, subItems: item.subItems.filter((s: { name: string }) => canAccessTab(s.name)) };
                  const isChildActive = item.subItems.some((s: { name: string }) => activeTab === s.name);
                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        onClick={() => {
                          item.setExpandedState?.(!item.expandedState);
                          const firstSubItem = item.subItems?.[0];
                          if (!isChildActive && firstSubItem) {
                            setActiveTab(firstSubItem.name);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                          isChildActive
                            ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        {isChildActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-green-600 dark:bg-green-500" />
                        )}
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 ${isChildActive ? "text-green-600 dark:text-green-500" : "text-slate-400 dark:text-slate-500"}`} />
                          {!sidebarCollapsed && <span>{item.name}</span>}
                        </div>
                        {!sidebarCollapsed && (
                          <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 text-slate-400 dark:text-slate-500 ${item.expandedState ? "rotate-180" : ""}`} />
                        )}
                      </button>

                      {item.expandedState && !sidebarCollapsed && (
                        <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-4 animate-in slide-in-from-top-1 duration-200">
                          {item.subItems.map((subItem: any) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = activeTab === subItem.name;
                            return (
                              <button
                                key={subItem.name}
	                                onClick={() => {
	                                  setActiveTab(subItem.name);
	                                  setIsMobileSidebarOpen(false);
	                                  triggerToast(`Switched workspace to ${subItem.name}`, "info");
	                                }}
                                className={`w-full flex items-center space-x-2.5 p-2 rounded-lg text-xs font-bold transition-all relative ${
                                  isSubActive
                                    ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-805/30"
                                }`}
                              >
                                <SubIcon className={`h-4 w-4 ${isSubActive ? "text-green-500" : "text-slate-400"}`} />
                                <span className="truncate">{subItem.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
	                    onClick={() => {
	                      setActiveTab(item.name);
	                      setIsMobileSidebarOpen(false);
	                      triggerToast(`Switched workspace to ${item.name}`, "info");
	                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                      isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    
                    {/* Active State Pill Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-green-600 dark:bg-green-500" />
                    )}

                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${isActive ? "text-green-600 dark:text-green-500" : "text-slate-400 dark:text-slate-500"}`} />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </div>

                    {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}

                  </button>
                );
              })}
            </div>

            {/* Sidebar Footer (User Info & Logout) */}
            <div className="shrink-0 p-3 border-t border-slate-200 dark:border-slate-700 font-sans">
              {sidebarCollapsed ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 dark:from-green-500 dark:to-teal-400 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-green-500/10" title={`${currentUser?.name} (${ROLE_LABELS[currentUser?.role ?? ""]})`}>
                    {currentUser?.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() ?? "??"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 dark:from-green-500 dark:to-teal-400 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-green-500/10">
                      {currentUser?.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() ?? "??"}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{currentUser?.name ?? "—"}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider font-bold">{ROLE_LABELS[currentUser?.role ?? ""] ?? "—"}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

          </aside>

          {/* ============================================================ */}
          {/* 3. MAIN WORKSPACE / SERVICE QUEUE */}
          {/* ============================================================ */}
          <main className="flex-1 flex overflow-hidden">
            {["Dashboard", "BI Analytics", "Customers", "Payments", "CRM"].includes(activeTab) ? (
              renderCoreBusinessTabs()
            ) : activeTab === "Service Queue" ? (
              <>
                {/* Left Content Area (Grid of Job Cards) */}
	            <div className="flex-1 flex flex-col overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5">
              
              {/* Header Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">Active Workshop Queue</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage service tickets, allocate technicians, approve estimates, and process gate passes.
                  </p>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700">
                    Total Load: {jobs.length} Bikes
                  </span>
                  <button
                    onClick={() => {
                      triggerToast("Refreshing service queue data...", "info");
                    }}
                    className="p-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status Filter Row */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                {[
                  { label: "All Jobs", count: stats.all },
                  { label: "Under Servicing", count: stats.underServicing, hint: "Includes Client Agreed, WIP, On Hold, Work Completed" },
                  { label: "Ready for Delivery", count: stats.ready, hint: "Includes Out for Delivery" },
                  { label: "Payment Processing", count: stats.payment },
                  { label: "Completed", count: stats.completed, hint: "Includes Delivered" }
                ].map((filter) => {
                  const isActive = activeFilter === filter.label;
                  return (
                    <button
                      key={filter.label}
                      onClick={() => setActiveFilter(filter.label)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isActive
                          ? "bg-slate-900 text-white dark:bg-green-500 dark:text-slate-900 border-slate-900 dark:border-green-500 shadow-md shadow-green-500/10"
                          : "bg-white text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 dark:bg-slate-950/20 text-current" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar + Filters Row */}
              <div className="flex flex-col md:flex-row gap-3">
                
                {/* Search query input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Vehicle No, Customer Name, Model or Phone..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/80 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Auxiliary filters (Dates & Branches) */}
                <div className="flex gap-2">
                  <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none">
                    <option>Today: 29 May</option>
                    <option>Yesterday: 28 May</option>
                    <option>Last 7 Days</option>
                    <option>All History</option>
                  </select>
                  <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none">
                    <option>Priority: All</option>
                    <option>Urgency: High</option>
                    <option>Urgency: Medium</option>
                    <option>Urgency: Low</option>
                  </select>
                </div>

              </div>

              {/* Empty state if filtered jobs list is empty */}
              {filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                  <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm">No job cards match your query</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try relaxing filters or search terms</p>
                </div>
              ) : (
                
                /* Job Cards Grid */
	                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job) => {
                    const isSelected = selectedJob && selectedJob.id === job.id;
                    return (
                      <div
                        key={job.id}
                        onClick={() => {
                          setExpandedCardId(job.id);
                          setSelectedJob(job);
                          setIsSidePanelOpen(true);
                        }}
                        className={`bg-white dark:bg-slate-900 border transition-all duration-300 rounded-[2.5rem] p-1.5 shadow-sm space-y-1.5 cursor-pointer group hover:shadow-xl hover:scale-[1.005] ${isSelected ? 'ring-2 ring-green-500 border-transparent' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                        {/* Top Segment (Header) */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-t-[2.2rem] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm">
                              <Shield className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase">{job.vehicleNo}</span>
                              <span className="text-xs font-bold text-red-500">(Bhubaneswar)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Bike className="h-5 w-5 text-slate-400" />
                            <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{job.brandModel}</span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-lg border border-teal-100 dark:border-teal-800">
                              <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 mr-2 uppercase tracking-widest">KMS</span>
                              <span className="text-xs font-black text-teal-700 dark:text-teal-300 font-mono">{job.kms.toString().padStart(6, '0')}</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-700 pl-4 flex items-center">
                              <span className="uppercase">NA | bike</span>
                              <span className={`ml-4 px-2 py-0.5 rounded uppercase font-black ${getStatusBadgeStyle(job.status)}`}>
                                {job.status === "Under Servicing" ? "IN-PROGRESS" : job.status === "Ready for Delivery" ? "READY" : "DONE"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Middle Segment */}
                        {(() => {
                          const isExpanded = expandedCardId === job.id;
                          const currentRating = jobRatings[job.id] ?? (job as any).rating ?? 0;
                          const notReady = !job.isEstimated || job.estimate === 0;
                          const actions = [
                            { icon: FileText, label: "JC/Est" },
                            { icon: ThumbsUp, label: "Status", disabled: notReady },
                            { icon: RefreshCw, label: "History" },
                            { icon: DollarSign, label: "Payments", disabled: notReady },
                            { icon: Percent, label: "Discount", disabled: notReady },
                            { icon: Printer, label: "Invoice", disabled: notReady || job.due > 0 },
                            { icon: isExpanded ? ChevronUp : MoreHorizontal, label: isExpanded ? "View Less" : "View More", isMore: true },
                          ];
                          const infoFields = (
                            <>
                              <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Customer Name</span>
                                {job.customerName.length > 15 ? (() => {
                                  const parts = job.customerName.trim().split(' ');
                                  const lastName = parts[parts.length - 1];
                                  const firstName = parts.slice(0, -1).join(' ') || lastName;
                                  return (
                                    <div className="flex flex-col leading-tight">
                                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase">{firstName}</span>
                                      {parts.length > 1 && <span className="text-xs font-black text-slate-800 dark:text-white uppercase">{lastName}</span>}
                                    </div>
                                  );
                                })() : (
                                  <span className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">{job.customerName}</span>
                                )}
                              </div>
                              <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Phone Number</span>
                                <span className="text-xs font-black text-slate-800 dark:text-white leading-none font-mono">{job.phone}</span>
                              </div>
                              <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Source</span>
                                <span className="text-xs font-black text-slate-800 dark:text-white leading-none">Walk-in</span>
                              </div>
                              <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Rating</span>
                                <div className="flex items-center space-x-0.5">
                                  {[1,2,3,4,5].map(star => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setJobRatings(prev => ({ ...prev, [job.id]: star }));
                                        fetch(`${API_BASE_URL}/job-cards/${job.id}/rating`, {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ rating: star }),
                                        }).catch(() => {});
                                        triggerToast(`Rating updated to ${star} star${star > 1 ? 's' : ''}`, "success");
                                      }}
                                      className="focus:outline-none hover:scale-125 transition-transform"
                                    >
                                      <Star className={`h-3 w-3 ${star <= currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Advisor</span>
                                <span className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">{job.advisor.trim().split(' ')[0]}</span>
                              </div>
                            </>
                          );
                          const actionButtons = actions.map((action, i) => (
                            <button
                              key={i}
                              type="button"
                              disabled={(action as any).disabled}
                              className={`flex flex-col items-center space-y-1 focus:outline-none shrink-0 ${(action as any).disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer group/btn'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if ((action as any).disabled) return;
                                if (action.label === "View More") {
                                  setExpandedCardId(job.id);
                                  setSelectedJob(job);
                                  setIsSidePanelOpen(true);
                                } else if (action.label === "View Less") {
                                  setExpandedCardId(null);
                                  setIsSidePanelOpen(false);
                                } else {
                                  handleJobAction(job, action.label);
                                }
                              }}
                            >
                              <div className={`p-2 rounded-full shadow-sm transition-all ${(action as any).disabled ? '' : 'group-hover/btn:scale-110'} ${
                                action.isMore ? 'bg-teal-500 text-white' :
                                'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover/btn:text-slate-800 dark:group-hover/btn:text-white border border-slate-100 dark:border-slate-700'
                              }`}>
                                <action.icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-400">{action.label}</span>
                            </button>
                          ));
                          /* Always compact single row — side panel opens for details */
                          return (
                            <div className="bg-white dark:bg-slate-900 px-6 py-3">
                              <div className="flex items-center w-full min-w-0">
                                <div className="flex items-center gap-x-6 flex-1 min-w-0 overflow-hidden">
                                  {infoFields}
                                </div>
                                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 shrink-0 mx-4" />
                                <div className="flex items-center gap-x-4 shrink-0">
                                  {actionButtons}
                                  <div className="relative flex items-center justify-center shrink-0">
                                    <svg className="w-12 h-12 transform -rotate-90">
                                      <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4" fill="transparent" />
                                      <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-teal-500" strokeWidth="4" fill="transparent"
                                        strokeDasharray={125.7}
                                        strokeDashoffset={125.7 - (125.7 * job.completion) / 100}
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <span className="absolute text-[11px] font-black text-slate-800 dark:text-white">{job.completion}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Bottom Segment (Billing & Dates) */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-b-[2.2rem] px-6 py-3 flex flex-row flex-wrap items-center gap-x-6 gap-y-2">
                          <div className="flex items-center bg-teal-500 text-white rounded-xl overflow-hidden shadow-sm shrink-0">
                            <div className="px-3 py-1.5 text-[10px] font-black border-r border-white/20 uppercase tracking-wider">JC.No:</div>
                            <div className="px-3 py-1.5 text-xs font-black font-mono">{job.id.split('-').pop()}</div>
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-[11px] font-black text-teal-600 dark:text-teal-400">₹{job.estimate.toLocaleString()}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Estimate</span>
                          </div>
                          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0" />
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-[11px] font-black text-teal-600 dark:text-teal-400">NA</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Inv No</span>
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-[11px] font-black text-teal-600 dark:text-teal-400">{(job as any).overallDiscount?.toFixed(2) || "0.00"}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Discount</span>
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-[11px] font-black text-teal-600 dark:text-teal-400">0</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Coupon</span>
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-[11px] font-black text-teal-600 dark:text-teal-400">₹{job.paid.toLocaleString()}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Paid</span>
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <span className={`text-[11px] font-black ${job.due > 0 ? "text-red-500 animate-pulse" : "text-teal-600"} dark:text-teal-400`}>₹{job.due.toLocaleString()}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Due</span>
                          </div>
                          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0" />
                          <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-black shadow-sm shrink-0">
                            <span className="text-slate-400 uppercase mr-1">DOA:</span>
                            <span className="text-teal-600 dark:text-teal-400 font-mono uppercase">{job.date}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-black shadow-sm shrink-0">
                            <span className="text-slate-400 uppercase mr-1">DOD:</span>
                            <span className="text-teal-600 dark:text-teal-400 font-mono uppercase">NA</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* ============================================================ */}
            {/* 4. SIDE PANEL (Full Details View) */}
            {/* ============================================================ */}
	            {isSidePanelOpen && selectedJob && (
	              <>
	              <button
	                type="button"
	                aria-label="Close job details"
	                onClick={() => { setIsSidePanelOpen(false); setExpandedCardId(null); }}
	                className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"
	              />
	              <div className="fixed md:relative inset-y-0 right-0 z-40 w-full max-w-[480px] md:w-[480px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex flex-col overflow-hidden h-full shadow-2xl transition-transform duration-300">
                
                {/* Header Panel */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">
                      ACTIVE CARD
                    </span>
                    <span className="font-mono text-xs font-extrabold text-slate-500 dark:text-slate-400">{selectedJob.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isEditingSidePanel ? (
                      <button
                        onClick={() => {
                          setEditedJob({ ...selectedJob });
                          setIsEditingSidePanel(true);
                        }}
                        className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                        title="Edit Job Card"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={async () => {
                            if (!editedJob) return;
                            try {
                              const res = await fetch(`${API_BASE_URL}/job-cards/${editedJob.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(editedJob)
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
                                setSelectedJob(updated);
                                setIsEditingSidePanel(false);
                                triggerToast("Job card updated successfully!", "success");
                              }
                            } catch (err) {
                              console.error("Backend offline, updating locally", err);
                              setJobs(prev => prev.map(j => j.id === editedJob.id ? editedJob : j));
                              setSelectedJob(editedJob);
                              setIsEditingSidePanel(false);
                              triggerToast("Job card updated (Local Fallback)!", "success");
                            }
                          }}
                          className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingSidePanel(false)}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-[10px] font-bold rounded-lg hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setIsSidePanelOpen(false);
                        setIsEditingSidePanel(false);
                        setExpandedCardId(null);
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Header details info */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700/40 flex justify-between items-start">
                  <div>
                    {isEditingSidePanel && editedJob ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedJob.vehicleNo}
                          onChange={(e) => setEditedJob({ ...editedJob, vehicleNo: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold font-mono"
                        />
                        <input
                          type="text"
                          value={editedJob.brandModel}
                          onChange={(e) => setEditedJob({ ...editedJob, brandModel: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-lg font-black tracking-wide font-mono text-slate-900 dark:text-white">
                          {selectedJob.vehicleNo}
                        </h2>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">{selectedJob.brandModel}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Owner: {selectedJob.customerName}</p>
                      </>
                    )}
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-full ${getStatusBadgeStyle(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">{selectedJob.date}</span>
                  </div>
                </div>

                {/* Tab selector menu */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs">
                  {["Overview", "Complaints", "Spares", "Services", "Timeline"].map((tab) => {
                    const isActive = sidePanelTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setSidePanelTab(tab)}
                        className={`flex-1 text-center py-2.5 font-bold transition-all relative border-b-2 ${
                          isActive
                            ? "border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 bg-green-50/10"
                            : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  
                  {/* OVERVIEW TAB */}
                  {sidePanelTab === "Overview" && (
                    <div className="space-y-4">
                      
                      {/* Customer Cards Details */}
	                      <div className="bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Customer Context</h4>
                        {isEditingSidePanel && editedJob ? (
                          <div className="space-y-3 text-xs">
                            <div className="flex flex-col space-y-1">
                              <span className="text-slate-400">Full Name:</span>
                              <input
                                type="text"
                                value={editedJob.customerName}
                                onChange={(e) => setEditedJob({ ...editedJob, customerName: e.target.value })}
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                              />
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-slate-400">Phone Code:</span>
                              <input
                                type="text"
                                value={editedJob.phone}
                                onChange={(e) => setEditedJob({ ...editedJob, phone: e.target.value })}
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span className="text-slate-400">Full Name:</span><span className="font-semibold">{selectedJob.customerName}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Phone Code:</span><span className="font-semibold">{selectedJob.phone}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Alternates:</span><span className="font-semibold">N/A</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">GSTIN Status:</span><span className="font-semibold font-mono text-[11px] text-green-600 dark:text-green-400">21AAAAA0000A1Z0</span></div>
                          </div>
                        )}
                      </div>

                      {/* Technical Specs Checklist */}
	                      <div className="bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Technical & Checklist Specifications</h4>
                        {isEditingSidePanel && editedJob ? (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex flex-col space-y-1">
                              <span className="text-[10px] text-slate-400">Odometer Reading:</span>
                              <input
                                type="number"
                                value={editedJob.kms}
                                onChange={(e) => setEditedJob({ ...editedJob, kms: parseInt(e.target.value) || 0 })}
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                              />
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-[10px] text-slate-400">Vehicle Category:</span>
                              <span className="font-bold py-1">Scooter Premium</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-[10px] text-slate-400">Service Advisor:</span>
                              <select
                                value={editedJob.advisor}
                                onChange={(e) => setEditedJob({ ...editedJob, advisor: e.target.value })}
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-indigo-600 dark:text-indigo-400"
                              >
                                {supervisorsList.map((s, i) => <option key={i} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-[10px] text-slate-400">Primary Tech:</span>
                              <select
                                value={editedJob.technician}
                                onChange={(e) => setEditedJob({ ...editedJob, technician: e.target.value })}
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-green-600 dark:text-green-400"
                              >
                                {techniciansList.map((t, i) => <option key={i} value={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex flex-col"><span className="text-[10px] text-slate-400">Odometer Reading:</span><span className="font-bold mt-0.5">{selectedJob.kms.toLocaleString()} KMS</span></div>
                            <div className="flex flex-col"><span className="text-[10px] text-slate-400">Vehicle Category:</span><span className="font-bold mt-0.5">Scooter Premium</span></div>
                            <div className="flex flex-col"><span className="text-[10px] text-slate-400">Service Advisor:</span><span className="font-bold mt-0.5 text-indigo-600 dark:text-indigo-400">{selectedJob.advisor}</span></div>
                            <div className="flex flex-col"><span className="text-[10px] text-slate-400">Primary Tech:</span><span className="font-bold mt-0.5 text-green-600 dark:text-green-400">{selectedJob.technician}</span></div>
                          </div>
                        )}
                      </div>

                      {/* Budget summary */}
	                      <div className="bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Estimation Split</h4>
                        <div className="space-y-2 text-xs font-semibold">
                          <div className="flex justify-between"><span className="text-slate-400">Subtotal:</span><span>₹{selectedJob.estimate - 150}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Applicable GST (18%):</span><span>₹150</span></div>
                          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm"><span className="text-slate-800 dark:text-slate-200">Billed Total:</span><span className="text-green-600 dark:text-green-400">₹{selectedJob.estimate}</span></div>
                        </div>
                      </div>

                      {/* Action buttons after bill total */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => router.push(`/estimation/${selectedJob.id}`)}
                          className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 hover:text-green-700 dark:text-green-400 hover:bg-green-500/10 font-bold text-xs transition-all"
                        >
                          <Wrench className="h-4 w-4" />
                          <span>Estimate</span>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`${API_BASE_URL}/job-cards/${selectedJob.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completion: 100, actualDeliveryDate: new Date().toISOString() }) });
                              if (res.ok) { const u = await res.json(); setJobs(prev => prev.map(j => j.id === u.id ? u : j)); setSelectedJob(u); }
                            } catch { setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, completion: 100 } : j)); }
                            addTimelineEntry(selectedJob.id, "Gate Pass Issued 🎉", `Vehicle ${selectedJob.vehicleNo} is cleared and ready to roll — safe travels!`);
                            triggerToast(`Gate Pass issued for ${selectedJob.vehicleNo}!`, "success");
                          }}
                          className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Gate Pass</span>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`${API_BASE_URL}/job-cards/${selectedJob.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Completed", completion: 90 }) });
                              if (res.ok) { const u = await res.json(); setJobs(prev => prev.map(j => j.id === u.id ? u : j)); setSelectedJob(u); }
                              addTimelineEntry(selectedJob.id, "Vehicle Ready ✅", `${selectedJob.vehicleNo} — service complete, awaiting customer pickup`);
                              triggerToast("Job completed!", "success");
                            } catch { setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: "Completed", completion: 90 } : j)); addTimelineEntry(selectedJob.id, "Vehicle Ready ✅", `${selectedJob.vehicleNo} — service complete, awaiting customer pickup`); triggerToast("Marked complete", "success"); }
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors shadow-md"
                        >
                          Done
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this job card?")) return;
                            try { await fetch(`${API_BASE_URL}/job-cards/${selectedJob.id}`, { method: "DELETE" }); } catch { }
                            setJobs(prev => prev.filter(j => j.id !== selectedJob.id));
                            setSelectedJob(null); setIsSidePanelOpen(false); setExpandedCardId(null);
                            triggerToast("Job Card deleted!", "warn");
                          }}
                          className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 dark:text-red-400 transition-colors border border-transparent hover:border-red-200"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

		              </div>
		            )}

                  {/* COMPLAINTS TAB */}
                  {sidePanelTab === "Complaints" && (
                    <div className="space-y-3">
                      {selectedJob.complaints.map((complaint: Complaint, idx: number) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-start space-x-2.5">
                            <span className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs font-extrabold h-5 w-5 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="flex-1 text-xs">
                              <p className="font-bold text-slate-800 dark:text-slate-200">{complaint.text}</p>
                              <div className="mt-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-bold">WORKSHOP FINDING:</span>
                                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{complaint.finding}</p>
                              </div>
                              <span className="inline-block mt-2 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                ACTION: REPAIR NOW
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SPARES TAB */}
                  {sidePanelTab === "Spares" && (
                    <div className="space-y-3.5">
                      {selectedJob.spares.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
                          No spare parts issued yet. Search or allocate parts in the estimation panel.
                        </div>
                      ) : (
                        selectedJob.spares.map((spare: SpareItem, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <Package className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800 dark:text-slate-200">{spare.name}</h5>
                                <div className="flex space-x-2 mt-0.5 text-[10px] text-slate-400">
                                  <span>{spare.code}</span>
                                  <span>•</span>
                                  <span>{spare.hsn}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold block">₹{spare.price}</span>
                              <span className="text-[10px] text-slate-400">Qty: {spare.qty}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SERVICES TAB */}
                  {sidePanelTab === "Services" && (
                    <div className="space-y-3">
                      {selectedJob.services.map((service: ServiceItem, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-lg">
                              <Wrench className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800 dark:text-slate-200">{service.name}</h5>
                              <div className="flex space-x-2 mt-0.5 text-[10px] text-slate-400">
                                <span>{service.code}</span>
                                <span>•</span>
                                <span>{service.hsn}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-bold">₹{service.rate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TIMELINE TAB */}
                  {sidePanelTab === "Timeline" && (
                    <div className="relative pl-6 space-y-4">
                      
                      {/* Vertical line connector */}
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

                      {selectedJob.timeline.map((step: TimelineItem, idx: number) => (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-5 mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                            idx === selectedJob.timeline.length - 1 ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                          }`} />
                          
                          <div className="text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{step.title}</span>
                              <span className="text-[10px] text-slate-400">{step.time}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
	              </div>
		              </>
		            )}
	              </>
	            ) : activeTab === "Inventory" ? (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/50 dark:bg-slate-900">
                
                {/* ============================================================ */}
                {/* INVENTORY LEFT PANEL: SPARE PARTS MASTER LIST */}
                {/* ============================================================ */}
                <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden bg-white dark:bg-slate-900/60">
                  
                  {/* Search and Alert Widgets */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Spares Inventory Master</h3>
                      <button
                        onClick={() => setIsAddPartModalOpen(true)}
                        className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[10px] uppercase tracking-wide px-2.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Part</span>
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="text"
                        value={inventorySearchQuery}
                        onChange={(e) => setInventorySearchQuery(e.target.value)}
                        placeholder="Search parts by name, OEM no..."
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500/60 border border-slate-200 dark:border-slate-700/60"
                      />
                      {inventorySearchQuery && (
                        <button
                          onClick={() => setInventorySearchQuery("")}
                          className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-650"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Quick Filters */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => setInventoryFilter("all")}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${inventoryFilter === "all" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"}`}
                      >
                        All Parts ({inventoryList.length})
                      </button>
                      <button
                        onClick={() => setInventoryFilter("low")}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${inventoryFilter === "low" ? "bg-amber-500/10 text-amber-650 dark:bg-amber-500/20 dark:text-amber-400 shadow-sm" : "text-slate-500 hover:text-slate-750"}`}
                      >
                        Low Stock ({inventoryList.filter(p => p.stockQty <= p.minStockLevel && p.stockQty > 0).length})
                      </button>
                      <button
                        onClick={() => setInventoryFilter("out")}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${inventoryFilter === "out" ? "bg-red-500/10 text-red-650 dark:bg-red-500/20 dark:text-red-400 shadow-sm" : "text-slate-500 hover:text-slate-750"}`}
                      >
                        Out of Stock ({inventoryList.filter(p => p.stockQty === 0).length})
                      </button>
                    </div>
                  </div>

                  {/* Low Stock Alerts Widget */}
                  {inventoryList.some(p => p.stockQty <= p.minStockLevel) && (
                    <div className="px-5 py-3.5 bg-amber-50/40 dark:bg-amber-500/5 border-b border-slate-200 dark:border-slate-800 flex items-start space-x-3.5 text-xs">
                      <ShieldAlert className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-extrabold text-amber-900 dark:text-amber-450 block uppercase tracking-wide text-[10px]">Restocking Recommended</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {inventoryList.filter(p => p.stockQty <= p.minStockLevel).map(p => p.name).join(", ")} are currently under critical threshold values.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Spare parts master items list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {inventoryList
                      .filter(part => {
                        const matchesSearch = part.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) || part.partNumber.toLowerCase().includes(inventorySearchQuery.toLowerCase());
                        if (!matchesSearch) return false;
                        if (inventoryFilter === "low") return part.stockQty <= part.minStockLevel && part.stockQty > 0;
                        if (inventoryFilter === "out") return part.stockQty === 0;
                        return true;
                      })
                      .map(part => {
                        const isSelected = part.id === selectedPartId;
                        const isOut = part.stockQty === 0;
                        const isLow = part.stockQty <= part.minStockLevel;
                        
                        return (
                          <button
                            key={part.id}
                            onClick={() => setSelectedPartId(part.id)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col space-y-3.5 ${
                              isSelected
                                ? "bg-green-50/50 dark:bg-green-500/5 border-green-200 dark:border-green-500/30 shadow-md"
                                : "bg-white dark:bg-slate-800/40 border-slate-150 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div>
                                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">{part.name}</h4>
                                <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 mt-1 block tracking-wider">{part.partNumber}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase shrink-0 ${
                                isOut
                                  ? "bg-red-500/10 text-red-655 dark:text-red-400 border border-red-500/20"
                                  : isLow
                                    ? "bg-amber-500/10 text-amber-655 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                                    : "bg-green-500/10 text-green-655 dark:text-green-400 border border-green-500/20"
                              }`}>
                                {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                              </span>
                            </div>

                            {/* Stock Indicator Progress bar */}
                            <div className="w-full space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Stock Level: <strong className="text-slate-850 dark:text-slate-200">{part.stockQty} Units</strong></span>
                                <span>Min: {part.minStockLevel}</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    isOut
                                      ? "bg-red-500"
                                      : isLow
                                        ? "bg-amber-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{ width: `${Math.min(100, (part.stockQty / (part.minStockLevel * 2.5)) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>

                </div>

                {/* ============================================================ */}
                {/* INVENTORY RIGHT PANEL: DETAIL, BATCHES & TRANSACTIONS */}
                {/* ============================================================ */}
                {(() => {
                  const part = inventoryList.find(p => p.id === selectedPartId);
                  if (!part) return (
                    <div className="flex-1 flex items-center justify-center text-slate-500 p-8">
                      Select a part to view detailed stock ledger and batch movements.
                    </div>
                  );

                  return (
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
                      
                      {/* Part Information Card Header */}
                      <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl">
                            <Package className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h2 className="text-base font-black text-slate-850 dark:text-white">{part.name}</h2>
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-500">{part.category}</span>
                            </div>
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1.5 font-mono">
                              OEM No: <strong className="text-slate-700 dark:text-slate-350">{part.partNumber}</strong> | HSN: <strong className="text-slate-700 dark:text-slate-350">{part.hsnCode}</strong> | Supplier: <strong className="text-slate-700 dark:text-slate-350">{part.supplier}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price Indexes:</span>
                          <span className="text-base font-extrabold text-slate-800 dark:text-white">₹{part.price}</span>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 ml-1.5">MRP: ₹{part.mrp}</span>
                        </div>
                      </div>

                      {/* tab switch headers */}
                      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-850 pb-2">
                        <div className="flex bg-slate-200/80 dark:bg-slate-800/85 p-1 rounded-xl text-xs">
                          <button
                            onClick={() => setInventoryTabMode("batches")}
                            className={`px-4 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                              inventoryTabMode === "batches" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                            }`}
                          >
                            📦 Active Batches ({part.batches.length})
                          </button>
                          <button
                            onClick={() => setInventoryTabMode("transactions")}
                            className={`px-4 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                              inventoryTabMode === "transactions" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                            }`}
                          >
                            🔄 Movement History ({part.transactions.length})
                          </button>
                          <button
                            onClick={() => setInventoryTabMode("transfer")}
                            className={`px-4 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                              inventoryTabMode === "transfer" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                            }`}
                          >
                            ✈️ Garage Transfer
                          </button>
                        </div>
                      </div>

                      {/* Tab content space */}
                      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
                        
                        {/* 1. BATCHES PANEL */}
                        {inventoryTabMode === "batches" && (
                          <div className="space-y-6">
                            
                            {/* Table of Batches */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Stock Batches</h4>
                              <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800/80">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                                      <th className="py-2.5 px-3">Batch Number</th>
                                      <th className="py-2.5 px-3">In-Stock Qty</th>
                                      <th className="py-2.5 px-3">Cost Price (₹)</th>
                                      <th className="py-2.5 px-3">Expiry Date</th>
                                      <th className="py-2.5 px-3">Received Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {part.batches.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="py-4 px-3 italic text-slate-400 text-center">No active batches available. Replenish stock below.</td>
                                      </tr>
                                    ) : (
                                      part.batches.map((b, i) => (
                                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 text-slate-750 dark:text-slate-300">
                                          <td className="py-2.5 px-3 font-mono font-bold">{b.batchNo}</td>
                                          <td className="py-2.5 px-3 font-bold text-slate-850 dark:text-white">{b.qty} Units</td>
                                          <td className="py-2.5 px-3">₹{b.purchasePrice}</td>
                                          <td className="py-2.5 px-3">{b.expiryDate}</td>
                                          <td className="py-2.5 px-3 text-slate-500">{b.receivedDate}</td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Receive New Batch Inline Form */}
                            <form onSubmit={handleAddBatch} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/60 space-y-4">
                              <span className="text-[10px] font-black text-slate-555 dark:text-slate-400 uppercase tracking-wider block">Stock Replenishment (Receive Batch)</span>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex flex-col">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Batch Number</label>
                                  <input
                                    type="text"
                                    required
                                    value={newBatchForm.batchNo}
                                    onChange={(e) => setNewBatchForm(prev => ({ ...prev, batchNo: e.target.value }))}
                                    placeholder="e.g. BAT-NEW-01"
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Receive Qty</label>
                                  <input
                                    type="number"
                                    required
                                    value={newBatchForm.qty}
                                    onChange={(e) => setNewBatchForm(prev => ({ ...prev, qty: e.target.value }))}
                                    placeholder="e.g. 20"
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Purchase Cost (₹)</label>
                                  <input
                                    type="number"
                                    required
                                    value={newBatchForm.purchasePrice}
                                    onChange={(e) => setNewBatchForm(prev => ({ ...prev, purchasePrice: e.target.value }))}
                                    placeholder="e.g. 320"
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                                  <input
                                    type="text"
                                    value={newBatchForm.expiry}
                                    onChange={(e) => setNewBatchForm(prev => ({ ...prev, expiry: e.target.value }))}
                                    placeholder="e.g. Dec 2029 or N/A"
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                                  />
                                </div>
                              </div>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm self-end"
                              >
                                Receive & Post Batch
                              </button>
                            </form>

                          </div>
                        )}

                        {/* 2. TRANSACTION HISTORY TIMELINE */}
                        {inventoryTabMode === "transactions" && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stock Movement History</h4>
                            
                            {part.transactions.length === 0 ? (
                              <p className="text-xs italic text-slate-400 text-center py-6">No inventory transactions logged.</p>
                            ) : (
                              <div className="space-y-3.5">
                                {part.transactions.map((t, idx) => {
                                  const isPurchase = t.type === "purchase";
                                  const isIssue = t.type === "issue";
                                  const isTransfer = t.type === "transfer";
                                  const isReturn = t.type === "return";
                                  
                                  return (
                                    <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-150 dark:border-slate-800/80 text-xs shadow-xs">
                                      <div className="flex items-center space-x-3.5">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                          isPurchase ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" :
                                          isIssue ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                                          isTransfer ? "bg-purple-500/10 text-purple-650 dark:text-purple-400 border border-purple-500/20" :
                                          "bg-amber-500/10 text-amber-650 dark:text-amber-400 border border-amber-500/20"
                                        }`}>
                                          {t.type}
                                        </span>
                                        <div>
                                          <span className="font-extrabold text-slate-800 dark:text-slate-200 block">{t.details}</span>
                                          <span className="text-[9px] text-slate-400 mt-0.5 font-mono">Ref: {t.reference} | Date: {t.date}</span>
                                        </div>
                                      </div>
                                      <span className={`font-mono font-black text-sm ${isIssue || isTransfer ? "text-red-500" : "text-green-500"}`}>
                                        {isIssue || isTransfer ? "-" : "+"}{t.qty} Units
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 3. INTER-GARAGE TRANSFER PANEL */}
                        {inventoryTabMode === "transfer" && (
                          <div className="space-y-5">
                            
                            <div className="p-4 bg-indigo-50/40 dark:bg-slate-900/30 border border-indigo-100/50 dark:border-slate-800 rounded-2xl text-[10px] text-indigo-950 dark:text-slate-400 leading-relaxed space-y-2">
                              <span className="font-bold text-indigo-900 dark:text-slate-350 block">🚀 Inter-Garage Stock Transfer System</span>
                              <p>Transfer spare parts securely to other branches in the Bhubaneswar & Cuttack Monorepo cluster. Dispatches decrement local stock instantly and post a transit transaction in the ledger.</p>
                            </div>

                            <form onSubmit={handleTransferStock} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/65 space-y-4">
                              <span className="text-[10px] font-black text-slate-555 dark:text-slate-400 uppercase tracking-wider block">Initiate Garage Stock Dispatch</span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Target Garage / Branch</label>
                                  <select
                                    value={transferForm.targetGarage}
                                    onChange={(e) => setTransferForm(prev => ({ ...prev, targetGarage: e.target.value }))}
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                                  >
                                    <option value="Cuttack Hub">Cuttack Hub (Branch Code: CUT-01)</option>
                                    <option value="Bhubaneswar South">Bhubaneswar South (Branch Code: BBR-02)</option>
                                    <option value="Puri Depot">Puri Depot (Branch Code: PUR-03)</option>
                                    <option value="Rourkela Outlet">Rourkela Outlet (Branch Code: ROR-04)</option>
                                  </select>
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Transfer Qty (Units)</label>
                                  <input
                                    type="number"
                                    required
                                    value={transferForm.qty}
                                    onChange={(e) => setTransferForm(prev => ({ ...prev, qty: e.target.value }))}
                                    placeholder="Enter units to dispatch..."
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-[10px] text-slate-500 font-bold">Local stock available: {part.stockQty} Units</span>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors"
                                >
                                  Discharge & Transfer Stock
                                </button>
                              </div>
                            </form>

                          </div>
                        )}

                      </div>

                    </div>
                  );
                })()}

              </div>
            ) : activeTab === "Reports" ? (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/50 dark:bg-slate-900">
                
                {/* ============================================================ */}
                {/* REPORTS LEFT PANEL: REPORT SELECTOR LIST */}
                {/* ============================================================ */}
                <div className="w-full lg:w-[320px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden bg-white dark:bg-slate-900/60 shrink-0">
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
                    <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Reports Catalog</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Select a business dimension to run audit reports</p>
                  </div>
                  
                  {/* Reports Sidebar Menu */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {[
                      { id: "day-book", name: "Day Book Report", desc: "Daily Credit/Debit transactions", icon: FileText, color: "text-blue-500 bg-blue-500/10" },
                      { id: "invoice", name: "Invoice Report", desc: "List of job card billing status", icon: FileSpreadsheet, color: "text-green-500 bg-green-500/10" },
                      { id: "spares-consumption", name: "Spares Consumption", desc: "Parts usage & cost centers", icon: Package, color: "text-orange-500 bg-orange-500/10" },
                      { id: "technician-productivity", name: "Technician TAT", desc: "Productivity & averages", icon: Sliders, color: "text-purple-500 bg-purple-500/10" },
                      { id: "gst-filing", name: "GST Filing (GSTR-1)", desc: "Taxable values & cgst/sgst breakdown", icon: ShieldAlert, color: "text-red-500 bg-red-500/10" },
                      { id: "vendor-purchase", name: "Vendor Purchase", desc: "PO orders & stock arrivals", icon: FileText, color: "text-indigo-500 bg-indigo-500/10" },
                      { id: "customer-source", name: "Customer Acquisition", desc: "Marketing lead channels revenue", icon: User, color: "text-pink-500 bg-pink-500/10" },
                      { id: "stock-movement", name: "Stock In/Out", desc: "Velocity & opening/closing stock", icon: TrendingUp, color: "text-teal-500 bg-teal-500/10" }
                    ].map((report) => {
                      const IconComponent = report.icon;
                      const isSelected = selectedReportId === report.id;
                      return (
                        <button
                          key={report.id}
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setReportPaginationPage(1);
                            triggerToast(`Compiling ${report.name}...`, "info");
                          }}
                          className={`w-full text-left p-3 rounded-2xl flex items-start space-x-3 transition-all ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent"
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${report.color}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{report.name}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-550 line-clamp-1 mt-0.5">{report.desc}</p>
                          </div>
                          {isSelected && (
                            <ChevronRight className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* REPORTS RIGHT PANEL: ACTIVE WORKSPACE & DATA LISTING */}
                {/* ============================================================ */}
                {(() => {
                  const filteredData = getFilteredReportData();
                  const ITEMS_PER_PAGE = 5;
                  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
                  const paginatedData = filteredData.slice((reportPaginationPage - 1) * ITEMS_PER_PAGE, reportPaginationPage * ITEMS_PER_PAGE);

                  // Calculate KPIs on active (filtered) dataset
                  let kpiCards: { label: string; value: string; desc: string; color: string }[] = [];
                  if (selectedReportId === "day-book") {
                    const credits = filteredData.filter(d => d.type === "Credit").reduce((sum, d) => sum + d.amount, 0);
                    const debits = filteredData.filter(d => d.type === "Debit").reduce((sum, d) => sum + d.amount, 0);
                    kpiCards = [
                      { label: "Total Credit", value: `₹${credits.toLocaleString()}`, desc: "Incoming service revenue", color: "text-green-600 dark:text-green-400" },
                      { label: "Total Debit", value: `₹${debits.toLocaleString()}`, desc: "Supplier purchase payout", color: "text-red-600 dark:text-red-400" },
                      { label: "Net Cashflow", value: `₹${(credits - debits).toLocaleString()}`, desc: "Working ledger velocity", color: credits >= debits ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400" }
                    ];
                  } else if (selectedReportId === "invoice") {
                    const totalVal = filteredData.reduce((sum, d) => sum + d.total, 0);
                    const paidVal = filteredData.filter(d => d.status === "Paid").reduce((sum, d) => sum + d.total, 0);
                    const pendingVal = filteredData.filter(d => d.status === "Pending" || d.status === "Partially Paid").reduce((sum, d) => sum + d.total, 0);
                    kpiCards = [
                      { label: "Invoiced Volume", value: `₹${totalVal.toLocaleString()}`, desc: "Aggregate billings generated", color: "text-slate-800 dark:text-white" },
                      { label: "Realized Receipts", value: `₹${paidVal.toLocaleString()}`, desc: "Settled payment transactions", color: "text-green-600 dark:text-green-400" },
                      { label: "Receivables Outstanding", value: `₹${pendingVal.toLocaleString()}`, desc: "Pending settlement balance", color: "text-amber-600 dark:text-amber-400" }
                    ];
                  } else if (selectedReportId === "spares-consumption") {
                    const totalQty = filteredData.reduce((sum, d) => sum + d.qty, 0);
                    const totalVal = filteredData.reduce((sum, d) => sum + d.total, 0);
                    kpiCards = [
                      { label: "Units Outbound", value: `${totalQty} Units`, desc: "Spares discharged from warehouse", color: "text-orange-600 dark:text-orange-400" },
                      { label: "Aggregate Cost Value", value: `₹${totalVal.toLocaleString()}`, desc: "Material valuation consumed", color: "text-indigo-600 dark:text-indigo-400" }
                    ];
                  } else if (selectedReportId === "technician-productivity") {
                    const totalTickets = filteredData.reduce((sum, d) => sum + d.tickets, 0);
                    const avgTat = filteredData.length > 0 ? Math.round(filteredData.reduce((sum, d) => sum + d.avgTat, 0) / filteredData.length) : 0;
                    kpiCards = [
                      { label: "Completed Job Cards", value: `${totalTickets} JCs`, desc: "Services fulfilled by staff", color: "text-purple-600 dark:text-purple-400" },
                      { label: "Average Turn-Around", value: `${avgTat} mins`, desc: "Mean service completion speed", color: "text-blue-600 dark:text-blue-400" }
                    ];
                  } else if (selectedReportId === "gst-filing") {
                    const taxable = filteredData.reduce((sum, d) => sum + d.taxableVal, 0);
                    const gst = filteredData.reduce((sum, d) => sum + d.totalGst, 0);
                    kpiCards = [
                      { label: "Taxable Base Value", value: `₹${taxable.toLocaleString()}`, desc: "Tax-exemption threshold sales", color: "text-slate-800 dark:text-white" },
                      { label: "GST CGST/SGST collected", value: `₹${gst.toLocaleString()}`, desc: "Aggregate output tax liabilities", color: "text-red-600 dark:text-red-400" }
                    ];
                  } else if (selectedReportId === "vendor-purchase") {
                    const purchaseVal = filteredData.reduce((sum, d) => sum + d.value, 0);
                    const activePOs = filteredData.length;
                    kpiCards = [
                      { label: "Purchase Invoices", value: `${activePOs} POs`, desc: "Inventory procurement orders", color: "text-indigo-600 dark:text-indigo-400" },
                      { label: "Procurement Outflow", value: `₹${purchaseVal.toLocaleString()}`, desc: "Total asset acquisition spent", color: "text-indigo-600 dark:text-indigo-400" }
                    ];
                  } else if (selectedReportId === "customer-source") {
                    const totalCustomers = filteredData.reduce((sum, d) => sum + d.count, 0);
                    const totalRev = filteredData.reduce((sum, d) => sum + d.revenue, 0);
                    kpiCards = [
                      { label: "New Leads Sourced", value: `${totalCustomers} Leads`, desc: "Customer acquisition headcount", color: "text-pink-600 dark:text-pink-400" },
                      { label: "Sourced Value", value: `₹${totalRev.toLocaleString()}`, desc: "Direct sales channel attribution", color: "text-pink-600 dark:text-pink-400" }
                    ];
                  } else if (selectedReportId === "stock-movement") {
                    const inbound = filteredData.reduce((sum, d) => sum + d.stockIn, 0);
                    const outbound = filteredData.reduce((sum, d) => sum + d.stockOut, 0);
                    kpiCards = [
                      { label: "Total Received (Inbound)", value: `${inbound} Pcs`, desc: "Restock supply arrivals", color: "text-teal-600 dark:text-teal-400" },
                      { label: "Total Discharged (Outbound)", value: `${outbound} Pcs`, desc: "Workshop consumption velocity", color: "text-amber-600 dark:text-amber-400" }
                    ];
                  }

                  const getReportTitle = () => {
                    return selectedReportId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  };

                  return (
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6">
                      
                      {/* Workspace Header Panel */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                            <span>Business Audit Ledger</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-650" />
                            <span>System Compiled</span>
                          </div>
                          <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                            {getReportTitle()}
                          </h2>
                        </div>
                        
                        {/* Exports Button group */}
                        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm self-start sm:self-auto shrink-0">
                          <button
                            onClick={() => handleExportReport("excel")}
                            className="px-3.5 py-2 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all"
                          >
                            Excel
                          </button>
                          <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                          <button
                            onClick={() => handleExportReport("csv")}
                            className="px-3.5 py-2 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl transition-all"
                          >
                            CSV
                          </button>
                          <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                          <button
                            onClick={() => handleExportReport("pdf")}
                            className="px-3.5 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                          >
                            PDF
                          </button>
                        </div>
                      </div>

                      {/* Filter Controls Panel */}
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Universal Search</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={reportSearchText}
                              onChange={(e) => {
                                setReportSearchText(e.target.value);
                                setReportPaginationPage(1);
                              }}
                              placeholder="Filter particulars/names..."
                              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Period From</label>
                          <input
                            type="date"
                            value={reportDateFrom}
                            onChange={(e) => {
                              setReportDateFrom(e.target.value);
                              setReportPaginationPage(1);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-bold"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Period To</label>
                          <input
                            type="date"
                            value={reportDateTo}
                            onChange={(e) => {
                              setReportDateTo(e.target.value);
                              setReportPaginationPage(1);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-bold"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Categorization Filter</label>
                          <select
                            value={reportFilterStatus}
                            onChange={(e) => {
                              setReportFilterStatus(e.target.value);
                              setReportPaginationPage(1);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-bold"
                          >
                            <option value="All">All Transactions / Records</option>
                            <option value="Paid">Paid Outbound / Settled</option>
                            <option value="Pending">Pending Outstandings</option>
                            <option value="Credit">Credit Entries</option>
                            <option value="Debit">Debit Entries</option>
                          </select>
                        </div>
                      </div>

                      {/* KPIs Strip Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {kpiCards.map((card, i) => (
                          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">{card.label}</span>
                            <div className={`text-2xl font-black tracking-tight mt-2 ${card.color}`}>
                              {card.value}
                            </div>
                            <span className="text-[9px] text-slate-450 dark:text-slate-500 mt-1.5">{card.desc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Main Dynamic Table Container */}
                      <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                        <div className="flex-1 overflow-x-auto overflow-y-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                                {selectedReportId === "day-book" && (
                                  <>
                                    <th className="py-4 px-5">TX ID</th>
                                    <th className="py-4 px-5">Date</th>
                                    <th className="py-4 px-5">Particulars</th>
                                    <th className="py-4 px-5">Type</th>
                                    <th className="py-4 px-5">Amount</th>
                                    <th className="py-4 px-5">Mode</th>
                                  </>
                                )}
                                {selectedReportId === "invoice" && (
                                  <>
                                    <th className="py-4 px-5">Invoice No</th>
                                    <th className="py-4 px-5">Job Card No</th>
                                    <th className="py-4 px-5">Date</th>
                                    <th className="py-4 px-5">Customer</th>
                                    <th className="py-4 px-5">Subtotal</th>
                                    <th className="py-4 px-5">Tax (18%)</th>
                                    <th className="py-4 px-5">Total Bill</th>
                                    <th className="py-4 px-5">Status</th>
                                  </>
                                )}
                                {selectedReportId === "spares-consumption" && (
                                  <>
                                    <th className="py-4 px-5">Part No</th>
                                    <th className="py-4 px-5">Part Name</th>
                                    <th className="py-4 px-5">Category</th>
                                    <th className="py-4 px-5 text-center">Qty Consumed</th>
                                    <th className="py-4 px-5">Unit Price</th>
                                    <th className="py-4 px-5">Total Cost</th>
                                    <th className="py-4 px-5">Cost Center</th>
                                  </>
                                )}
                                {selectedReportId === "technician-productivity" && (
                                  <>
                                    <th className="py-4 px-5">Technician Name</th>
                                    <th className="py-4 px-5 text-center">JCs Completed</th>
                                    <th className="py-4 px-5 text-center">Avg TAT</th>
                                    <th className="py-4 px-5 text-center">Target TAT</th>
                                    <th className="py-4 px-5 text-center">Efficiency</th>
                                    <th className="py-4 px-5">Incentives Earned</th>
                                  </>
                                )}
                                {selectedReportId === "gst-filing" && (
                                  <>
                                    <th className="py-4 px-5">Customer Name</th>
                                    <th className="py-4 px-5">GSTIN</th>
                                    <th className="py-4 px-5">Invoice No</th>
                                    <th className="py-4 px-5">Date</th>
                                    <th className="py-4 px-5">Taxable base</th>
                                    <th className="py-4 px-5 text-center">GST Rate</th>
                                    <th className="py-4 px-5">CGST (9%)</th>
                                    <th className="py-4 px-5">SGST (9%)</th>
                                    <th className="py-4 px-5">Total Output GST</th>
                                  </>
                                )}
                                {selectedReportId === "vendor-purchase" && (
                                  <>
                                    <th className="py-4 px-5">Purchase PO No</th>
                                    <th className="py-4 px-5">Vendor Sourced</th>
                                    <th className="py-4 px-5">PO Date</th>
                                    <th className="py-4 px-5">Procured Item</th>
                                    <th className="py-4 px-5 text-center">Qty Sourced</th>
                                    <th className="py-4 px-5">Total PO Value</th>
                                    <th className="py-4 px-5">PO Status</th>
                                  </>
                                )}
                                {selectedReportId === "customer-source" && (
                                  <>
                                    <th className="py-4 px-5">Marketing Sourced Channel</th>
                                    <th className="py-4 px-5 text-center">Customer Count</th>
                                    <th className="py-4 px-5">Attributed Revenue</th>
                                    <th className="py-4 px-5">Average Ticket Size</th>
                                  </>
                                )}
                                {selectedReportId === "stock-movement" && (
                                  <>
                                    <th className="py-4 px-5">Part Description</th>
                                    <th className="py-4 px-5">Part Code</th>
                                    <th className="py-4 px-5 text-center">Opening Stock</th>
                                    <th className="py-4 px-5 text-center">Stock In</th>
                                    <th className="py-4 px-5 text-center">Stock Out</th>
                                    <th className="py-4 px-5 text-center">Inter-Garage Transfer</th>
                                    <th className="py-4 px-5 text-center">Closing Stock</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {paginatedData.length === 0 ? (
                                <tr>
                                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                    No records found matching current date filter or search query.
                                  </td>
                                </tr>
                              ) : (
                                paginatedData.map((row: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                                    {selectedReportId === "day-book" && (
                                      <>
                                        <td className="py-3 px-5 font-bold font-mono text-slate-800 dark:text-slate-200">{row.id}</td>
                                        <td className="py-3 px-5 font-semibold text-slate-550">{row.date}</td>
                                        <td className="py-3 px-5 font-bold">{row.particulars}</td>
                                        <td className="py-3 px-5">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            row.type === "Credit" ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                          }`}>
                                            {row.type}
                                          </span>
                                        </td>
                                        <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹{row.amount.toLocaleString()}</td>
                                        <td className="py-3 px-5 font-semibold text-slate-500">{row.mode}</td>
                                      </>
                                    )}
                                    {selectedReportId === "invoice" && (
                                      <>
                                        <td className="py-3 px-5 font-bold text-indigo-600 dark:text-indigo-400">{row.invoiceNo}</td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-400">{row.jobCardNo}</td>
                                        <td className="py-3 px-5 font-semibold">{row.date}</td>
                                        <td className="py-3 px-5 font-black text-slate-800 dark:text-slate-200">{row.customerName}</td>
                                        <td className="py-3 px-5 font-bold">₹{row.subtotal.toLocaleString()}</td>
                                        <td className="py-3 px-5 text-slate-400">₹{row.tax.toLocaleString()}</td>
                                        <td className="py-3 px-5 font-black text-slate-900 dark:text-white">₹{row.total.toLocaleString()}</td>
                                        <td className="py-3 px-5">
                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            row.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400" :
                                            row.status === "Partially Paid" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                          }`}>
                                            {row.status}
                                          </span>
                                        </td>
                                      </>
                                    )}
                                    {selectedReportId === "spares-consumption" && (
                                      <>
                                        <td className="py-3 px-5 font-mono font-bold text-slate-555">{row.partNo}</td>
                                        <td className="py-3 px-5 font-black text-slate-800 dark:text-white">{row.name}</td>
                                        <td className="py-3 px-5">
                                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">{row.category}</span>
                                        </td>
                                        <td className="py-3 px-5 text-center font-bold text-indigo-500">{row.qty} Pcs</td>
                                        <td className="py-3 px-5 font-semibold">₹{row.unitPrice.toLocaleString()}</td>
                                        <td className="py-3 px-5 font-black text-slate-900 dark:text-white">₹{row.total.toLocaleString()}</td>
                                        <td className="py-3 px-5 font-semibold text-slate-500">{row.costCenter}</td>
                                      </>
                                    )}
                                    {selectedReportId === "technician-productivity" && (
                                      <>
                                        <td className="py-3 px-5 font-black text-slate-800 dark:text-slate-200">{row.name}</td>
                                        <td className="py-3 px-5 text-center font-bold text-slate-600 dark:text-slate-300">{row.tickets}</td>
                                        <td className="py-3 px-5 text-center font-semibold text-blue-500">{row.avgTat} mins</td>
                                        <td className="py-3 px-5 text-center text-slate-400">{row.targetTat} mins</td>
                                        <td className="py-3 px-5 text-center">
                                          <span className="font-extrabold text-green-600 dark:text-green-400">{row.efficiency}%</span>
                                        </td>
                                        <td className="py-3 px-5 font-extrabold text-indigo-600 dark:text-indigo-400">₹{row.incentives.toLocaleString()}</td>
                                      </>
                                    )}
                                    {selectedReportId === "gst-filing" && (
                                      <>
                                        <td className="py-3 px-5 font-bold">{row.name}</td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-500">{row.gstin}</td>
                                        <td className="py-3 px-5 font-bold text-indigo-600 dark:text-indigo-400">{row.invNo}</td>
                                        <td className="py-3 px-5 font-semibold text-slate-500">{row.date}</td>
                                        <td className="py-3 px-5 font-bold">₹{row.taxableVal.toLocaleString()}</td>
                                        <td className="py-3 px-5 text-center font-bold text-slate-500">{row.rate}%</td>
                                        <td className="py-3 px-5 text-slate-400">₹{row.cgst.toLocaleString()}</td>
                                        <td className="py-3 px-5 text-slate-400">₹{row.sgst.toLocaleString()}</td>
                                        <td className="py-3 px-5 font-black text-red-500">₹{row.totalGst.toLocaleString()}</td>
                                      </>
                                    )}
                                    {selectedReportId === "vendor-purchase" && (
                                      <>
                                        <td className="py-3 px-5 font-bold font-mono text-indigo-500">{row.poNo}</td>
                                        <td className="py-3 px-5 font-black text-slate-800 dark:text-white">{row.vendor}</td>
                                        <td className="py-3 px-5 font-semibold text-slate-400">{row.date}</td>
                                        <td className="py-3 px-5 font-medium">{row.item}</td>
                                        <td className="py-3 px-5 text-center font-extrabold text-indigo-500">{row.qty} Units</td>
                                        <td className="py-3 px-5 font-black text-slate-900 dark:text-white">₹{row.value.toLocaleString()}</td>
                                        <td className="py-3 px-5">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            row.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                          }`}>
                                            {row.status}
                                          </span>
                                        </td>
                                      </>
                                    )}
                                    {selectedReportId === "customer-source" && (
                                      <>
                                        <td className="py-3 px-5 font-black text-slate-800 dark:text-white">{row.source}</td>
                                        <td className="py-3 px-5 text-center font-extrabold text-pink-500">{row.count} Leads</td>
                                        <td className="py-3 px-5 font-black text-slate-900 dark:text-white">₹{row.revenue.toLocaleString()}</td>
                                        <td className="py-3 px-5 font-bold text-slate-500">₹{row.ticketSize.toLocaleString()}</td>
                                      </>
                                    )}
                                    {selectedReportId === "stock-movement" && (
                                      <>
                                        <td className="py-3 px-5 font-black text-slate-800 dark:text-white">{row.name}</td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-500">{row.code}</td>
                                        <td className="py-3 px-5 text-center font-semibold text-slate-500">{row.opening} Pcs</td>
                                        <td className="py-3 px-5 text-center font-extrabold text-teal-600 dark:text-teal-400">+{row.stockIn}</td>
                                        <td className="py-3 px-5 text-center font-extrabold text-red-500">-{row.stockOut}</td>
                                        <td className="py-3 px-5 text-center font-medium text-slate-400">{row.transfer > 0 ? `${row.transfer} Pcs` : "-"}</td>
                                        <td className="py-3 px-5 text-center font-black text-indigo-600 dark:text-indigo-400">{row.closing} Pcs</td>
                                      </>
                                    )}
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Bar */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Showing {Math.min(filteredData.length, (reportPaginationPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredData.length, reportPaginationPage * ITEMS_PER_PAGE)} of {filteredData.length} entries
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              disabled={reportPaginationPage === 1}
                              onClick={() => setReportPaginationPage(prev => Math.max(1, prev - 1))}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                            >
                              Prev
                            </button>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 px-1">{reportPaginationPage} / {totalPages}</span>
                            <button
                              disabled={reportPaginationPage === totalPages}
                              onClick={() => setReportPaginationPage(prev => Math.min(totalPages, prev + 1))}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })()}

              </div>
            ) : activeTab === "Insurance" ? (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans">
                
                {/* ============================================================ */}
                {/* INSURANCE LEFT PANEL: PROVIDERS & RENEWALS */}
                {/* ============================================================ */}
                <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden bg-white dark:bg-slate-900/60 shrink-0">
                  
                  {/* Providers Header & Button */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Insurance Ledger</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Providers, Claims & Surveyor Audits</p>
                    </div>
                    <button
                      onClick={() => setIsAddProviderModalOpen(true)}
                      className="flex items-center space-x-1 bg-indigo-650 hover:bg-indigo-755 text-white font-extrabold text-[10px] uppercase tracking-wide px-2.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Provider</span>
                    </button>
                  </div>

                  {/* Dynamic Providers Scroll Container */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4 max-h-[220px] overflow-y-auto bg-slate-50/20">
                    <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Associated Providers</span>
                    <div className="grid grid-cols-2 gap-3">
                      {insuranceProviders.map((prov) => (
                        <div key={prov.id} className="bg-white dark:bg-slate-850 p-3 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-sm flex flex-col justify-between">
                          <span className="text-[10px] font-black text-slate-800 dark:text-white truncate">{prov.name}</span>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Claims: {prov.activeClaims}</span>
                            <span className="text-[8px] font-extrabold text-green-600 dark:text-green-400">{prov.settlementRatio}% SR</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Claims List Header & Subheader */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/20">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Claims Directory</span>
                      <button
                        onClick={() => setIsInitiateClaimModalOpen(true)}
                        className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[9px] uppercase tracking-wide px-2 py-1 rounded-lg transition-all active:scale-95 shadow-sm"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        <span>New Claim</span>
                      </button>
                    </div>
                    <div className="relative mt-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={claimSearchQuery}
                        onChange={(e) => setClaimSearchQuery(e.target.value)}
                        placeholder="Search claims by client/reg..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Claim Cases scroll */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {(() => {
                      const query = claimSearchQuery.toLowerCase();
                      const filtered = insuranceClaims.filter(c => 
                        c.customerName.toLowerCase().includes(query) || 
                        c.vehicleNo.toLowerCase().includes(query) || 
                        c.claimNo.toLowerCase().includes(query)
                      );
                      if (filtered.length === 0) {
                        return <p className="text-center text-[10px] text-slate-400 py-6">No matching claims found.</p>;
                      }
                      return filtered.map((c) => {
                        const isSelected = selectedClaimId === c.id;
                        const provider = insuranceProviders.find(p => p.id === c.providerId);
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedClaimId(c.id);
                              triggerToast(`Selected case file ${c.claimNo}`, "info");
                            }}
                            className={`w-full text-left p-3.5 rounded-2xl flex items-start justify-between border transition-all ${
                              isSelected
                                ? "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-205 dark:border-indigo-900/60 shadow-sm"
                                : "bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-slate-200 dark:border-slate-750"
                            }`}
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-xs text-indigo-650 dark:text-indigo-400">{c.claimNo}</span>
                                <span className="text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                                  {provider ? provider.code : "INS"}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{c.customerName}</h4>
                              <p className="text-[10px] text-slate-400 font-bold">{c.vehicleNo}</p>
                            </div>
                            <div className="text-right shrink-0 space-y-1">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">₹{c.totalClaimed.toLocaleString()}</span>
                              <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                  c.status === "Approved" ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400" :
                                  c.status === "Disbursed" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400" :
                                  c.status === "Rejected" ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400" :
                                  "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                }`}>
                                  {c.status}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>

                </div>

                {/* ============================================================ */}
                {/* INSURANCE RIGHT PANEL: SURVEYOR FILE MANAGER & SPLIT DETAILS */}
                {/* ============================================================ */}
                {(() => {
                  const activeClaim = insuranceClaims.find(c => c.id === selectedClaimId);
                  if (!activeClaim) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                        <ShieldAlert className="h-12 w-12 text-slate-350 dark:text-slate-700 animate-pulse mb-3" />
                        <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">No Claim File Selected</h3>
                        <p className="text-xs mt-1">Select a claim from the list to view auditor splits.</p>
                      </div>
                    );
                  }

                  const provider = insuranceProviders.find(p => p.id === activeClaim.providerId);
                  const customerShare = Math.max(0, activeClaim.totalClaimed - (activeClaim.surveyorApprovedSpares + activeClaim.surveyorApprovedLabor));
                  
                  return (
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6">
                      
                      {/* Claim Header Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                            <span>Claim Case Portal</span>
                            <span className="h-1 w-1 rounded-full bg-indigo-300" />
                            <span>Job Card: {activeClaim.jobCardId}</span>
                          </div>
                          <h2 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide">
                            {activeClaim.customerName} &bull; <span className="font-mono text-slate-500">{activeClaim.vehicleNo}</span>
                          </h2>
                          <p className="text-[10px] text-slate-400 font-bold">Policy Number: {activeClaim.providerId === "prov-1" ? "POL-88201" : "POL-99212"} &bull; Sourced from {provider ? provider.name : "Direct Carrier"}</p>
                        </div>
                        
                        {/* Status workflow triggers */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleUpdateClaimStatus(activeClaim.id, "Approved")}
                            className="px-3 py-1.5 text-[9px] font-black uppercase bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-all shadow-sm active:scale-95 font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateClaimStatus(activeClaim.id, "Disbursed")}
                            className="px-3 py-1.5 text-[9px] font-black uppercase bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-sm active:scale-95 font-bold"
                          >
                            Disburse
                          </button>
                          <button
                            onClick={() => handleUpdateClaimStatus(activeClaim.id, "Rejected")}
                            className="px-3 py-1.5 text-[9px] font-black uppercase bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-sm active:scale-95 font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* Split Split visualizers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Aggregate Claimed</span>
                          <span className="text-2xl font-black text-slate-800 dark:text-white mt-2">₹{activeClaim.totalClaimed.toLocaleString()}</span>
                          <span className="text-[8px] text-slate-400 font-bold mt-1.5 uppercase">Estimated job ticket size</span>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Approved Liability (Carrier)</span>
                          <span className="text-2xl font-black text-green-600 dark:text-green-400 mt-2">
                            ₹{(activeClaim.surveyorApprovedSpares + activeClaim.surveyorApprovedLabor).toLocaleString()}
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold mt-1.5 uppercase">
                            Spares: ₹{activeClaim.surveyorApprovedSpares.toLocaleString()} | Labor: ₹{activeClaim.surveyorApprovedLabor.toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Customer Deductibles (Out of Pocket)</span>
                          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                            ₹{customerShare.toLocaleString()}
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold mt-1.5 uppercase">Depreciation, Consumibles & Taxes</span>
                        </div>
                      </div>

                      {/* Claims Splits Form and Policy Renewal Reminders */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-y-auto">
                        
                        {/* Surveyor Splits Editor Card */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col">
                          <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4">Surveyor Auditing Workspace</h3>
                          
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget;
                              const spares = parseFloat((form.elements.namedItem("spares") as HTMLInputElement).value) || 0;
                              const labor = parseFloat((form.elements.namedItem("labor") as HTMLInputElement).value) || 0;
                              const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;
                              handleUpdateClaimSplits(activeClaim.id, spares, labor, notes);
                            }}
                            className="space-y-4 flex-1 flex flex-col justify-between"
                          >
                            <div className="space-y-4">
                              <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-450 uppercase mb-1">Surveyor Approved Spares Cost (₹)</label>
                                <input
                                  type="number"
                                  name="spares"
                                  defaultValue={activeClaim.surveyorApprovedSpares}
                                  placeholder="e.g. 5000"
                                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-450 uppercase mb-1">Surveyor Approved Labor Cost (₹)</label>
                                <input
                                  type="number"
                                  name="labor"
                                  defaultValue={activeClaim.surveyorApprovedLabor}
                                  placeholder="e.g. 1500"
                                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-450 uppercase mb-1">Auditor Notes & Inspections Findings</label>
                                <textarea
                                  name="notes"
                                  rows={3}
                                  defaultValue={activeClaim.notes}
                                  placeholder="Type details regarding salvage value, depreciation brackets, or surveyor approvals..."
                                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none resize-none"
                                />
                              </div>
                            </div>
                            
                            <button
                              type="submit"
                              className="w-full mt-4 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-sm transition-colors"
                            >
                              Commit Claims Audits & Splits
                            </button>
                          </form>
                        </div>

                        {/* Renewals Schedule Report Card */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
                          <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">Upcoming Renewals Report</h3>
                          <span className="text-[9px] text-slate-400 font-bold mb-4 uppercase">Next 30 Days Expiry Schedules</span>
                          
                          <div className="flex-1 overflow-y-auto space-y-3">
                            {insurancePolicies.map((pol) => {
                              const provider = insuranceProviders.find(p => p.id === pol.providerId);
                              return (
                                <div key={pol.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-750 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                                  <div className="min-w-0 flex-1 space-y-0.5">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{pol.customerName}</h4>
                                    <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-mono font-bold">{pol.vehicleNo}</p>
                                    <p className="text-[9px] text-slate-400">Policy: {pol.policyNo} &bull; {provider ? provider.name : "General"}</p>
                                  </div>
                                  
                                  <div className="text-right shrink-0 space-y-1.5 pl-3">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-wide block font-bold">
                                      {pol.daysLeft} days left
                                    </span>
                                    <button
                                      onClick={() => triggerToast(`WhatsApp renewal prompt sent to ${pol.customerName}!`, "success")}
                                      className="px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 font-extrabold text-[9px] uppercase tracking-wide rounded-lg transition-all"
                                    >
                                      Send Prompt
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })()}

              </div>
            ) : [
              "GST Filing Reports",
              "By Insurance Claim",
              "Report By Invoices",
              "Spares Transfer",
              "Brandwise Consumables",
              "Consumable Brands",
              "Customer Source",
              "Insurance Provider",
              "Spares Master",
              "Vehicle Category",
              "Vehicle Models",
              "Workshop Info",
              "View Logs",
              "Inventory Management",
              "Manage Packages",
              "Manage Services",
              "View Deleted Records",
              "View Service History",
              "View Technician Productivity"
            ].includes(activeTab) ? (
              renderWorkshopConfigOrReports()
            ) : activeTab === "Manage Designation" ? (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 font-sans w-full">
                
                {/* Designation Directory Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                      <span>User & Access Roles</span>
                      <span className="h-1 w-1 rounded-full bg-slate-350" />
                      <span>Total Designations: {designations.length}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                      Manage Designations
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setDesignationForm("");
                      setIsNewDesignationOpen(true);
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 self-start sm:self-auto font-bold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Designation</span>
                  </button>
                </div>

                {/* Designation Search Bar */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                  <div className="flex flex-col flex-1 max-w-md">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Catalog</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        placeholder="Search designation name..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setEmployeeSearchQuery("");
                        triggerToast("Designation catalogue re-indexed", "info");
                      }}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 text-slate-500 transition-colors"
                      title="Refresh"
                    >
                      <Sliders className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Designation Grid Table */}
                <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                          <th className="py-4 px-6 w-20 text-center">Serial No.</th>
                          <th className="py-4 px-6">Designation Name</th>
                          <th className="py-4 px-6 w-48 text-center">Active Employee Count</th>
                          <th className="py-4 px-6 w-36 text-center">Action Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(() => {
                          const q = employeeSearchQuery.toLowerCase();
                          const filtered = designations.filter(d => d.toLowerCase().includes(q));
                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                  No designations found matching query.
                                </td>
                              </tr>
                            );
                          }
                          return filtered.map((desig, idx) => {
                            const count = employees.filter(e => e.designation === desig).length;
                            return (
                              <tr key={desig} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-750 dark:text-slate-350 transition-colors animate-in fade-in duration-150">
                                <td className="py-4 px-6 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                                <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wide">{desig}</td>
                                <td className="py-4 px-6 text-center">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 uppercase">
                                    {count} active staff
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => {
                                        setSelectedDesignation(desig);
                                        setIsViewDesignationOpen(true);
                                      }}
                                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-teal-500 transition-colors"
                                      title="View Details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedDesignation(desig);
                                        setDesignationForm(desig);
                                        setIsEditDesignationOpen(true);
                                      }}
                                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-450 dark:text-slate-650 transition-colors"
                                      title="Edit Record"
                                    >
                                      <Sliders className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDesignation(desig)}
                                      className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                      title="Delete Designation"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Displaying 1 to {designations.length} of {designations.length} designations
                    </span>
                  </div>

                </div>

              </div>
            ) : activeTab === "Manage Employee" ? (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900 font-sans w-full">
                

                  <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/30 p-6 space-y-6 min-w-0 w-full">
                    
                    {/* Employee List Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                      <div>
                        <div className="flex items-center space-x-2 text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                          <span>WMS Employee Registry</span>
                          <span className="h-1 w-1 rounded-full bg-slate-350" />
                          <span>Total Staff: {employees.length}</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1 uppercase tracking-wide">
                          Employee Accounts
                        </h2>
                      </div>
                    </div>

                    {/* Modern Stats summary cards strip - Modern Touch */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 font-sans">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-3 transition-all hover:scale-[1.02] hover:shadow-md duration-200">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Total Staff</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white leading-none">{employees.length} Members</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-3 transition-all hover:scale-[1.02] hover:shadow-md duration-200">
                        <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-xl">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Unique Branches</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                            {new Set(employees.map(e => e.workshopId)).size} Branch
                          </span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-3 transition-all hover:scale-[1.02] hover:shadow-md duration-200">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 rounded-xl">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Role Assignments</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white leading-none">{userRoles.length} Security</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center space-x-3 transition-all hover:scale-[1.02] hover:shadow-md duration-200">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Mobile Auth</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                            {employees.filter(e => e.mobileAuth).length} Verified
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                        <button
                          onClick={() => {
                            setEmployeeForm({
                              workshopId: "Bike Masters",
                              firstName: "",
                              lastName: "",
                              username: "",
                              email: "",
                              contact: "",
                              designation: selectedDesignation,
                              pwdExpiry: "2027-12-31",
                              dob: "",
                              anniversary: "",
                              address: ""
                            });
                            setIsEmployeeModalOpen(true);
                          }}
                          className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>New</span>
                        </button>

                        <button
                          onClick={() => {
                            const emp = employees.find(e => e.id === selectedEmployeeId);
                            if (!emp) {
                              triggerToast("Please select an employee in table first", "warn");
                              return;
                            }
                            setEmployeeForm({
                              workshopId: emp.workshopId,
                              firstName: emp.firstName,
                              lastName: emp.lastName,
                              username: emp.username,
                              email: emp.email,
                              contact: emp.contact,
                              designation: emp.designation,
                              pwdExpiry: emp.pwdExpiry,
                              dob: emp.dob || "",
                              anniversary: emp.anniversary || "",
                              address: emp.address || ""
                            });
                            setIsEditEmployeeOpen(true);
                          }}
                          className="flex items-center space-x-1 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-slate-700 dark:border-slate-650 shadow-sm active:scale-95"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            const emp = employees.find(e => e.id === selectedEmployeeId);
                            if (!emp) {
                              triggerToast("Please select an employee in table first", "warn");
                              return;
                            }
                            setViewEmployeeActiveSubTab("profile");
                            setIsViewEmployeeOpen(true);
                          }}
                          className="px-3.5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm font-bold flex items-center space-x-1 active:scale-95"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>

                        {/* User Roles Direct Action */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedEmployeeId) {
                              triggerToast("Please select an employee in table first", "warn");
                              return;
                            }
                            setActivePermissionsTab("roles");
                            setIsAccessPanelOpen(true);
                            triggerToast("Opening Roles Manager...", "info");
                          }}
                          className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-1.5 active:scale-95 border border-indigo-500/10"
                        >
                          <Users className="h-3.5 w-3.5 text-white" />
                          <span>Roles</span>
                        </button>

                        {/* User Permissions Direct Action */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedEmployeeId) {
                              triggerToast("Please select an employee in table first", "warn");
                              return;
                            }
                            setActivePermissionsTab("permissions");
                            setIsAccessPanelOpen(true);
                            triggerToast("Opening Permissions Matrix...", "info");
                          }}
                          className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-1.5 active:scale-95 border border-purple-500/10"
                        >
                          <Lock className="h-3.5 w-3.5 text-white" />
                          <span>Permissions</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedEmployeeId) {
                              triggerToast("Please select an employee in table first", "warn");
                              return;
                            }
                            handleDeleteEmployee(selectedEmployeeId);
                          }}
                          className="px-3.5 py-2.5 bg-red-500 hover:bg-red-650 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1 active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Search & filters bar */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                      <div className="flex flex-col col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Roster Search</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={employeeSearchQuery}
                            onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                            placeholder="Search employee by name, username, or contact..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter by Designation</label>
                        <select
                          value={employeeFilterDesignation}
                          onChange={(e) => setEmployeeFilterDesignation(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-bold"
                        >
                          <option value="All">All Designations</option>
                          {designations.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Employees roster table */}
                    <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-0">
                      <div className="flex-1 overflow-x-auto overflow-y-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                              <th className="py-4 px-5 w-12 text-center">Select</th>
                              <th className="py-4 px-5">Workshop Branch</th>
                              <th className="py-4 px-5">First Name</th>
                              <th className="py-4 px-5">Last Name</th>
                              <th className="py-4 px-5">Username</th>
                              <th className="py-4 px-5">Email ID</th>
                              <th className="py-4 px-5">Designation</th>
                              <th className="py-4 px-5">Pwd Expiry</th>
                              <th className="py-4 px-5">Contact</th>
                              <th className="py-4 px-5 text-center">Mobile Auth</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(() => {
                              const q = employeeSearchQuery.toLowerCase();
                              const filtered = employees.filter(e => {
                                const matchesQuery = e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) || e.username.toLowerCase().includes(q) || e.contact.includes(q);
                                const matchesDesig = employeeFilterDesignation === "All" || e.designation === employeeFilterDesignation;
                                return matchesQuery && matchesDesig;
                              });
                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                      No employee profiles found in designated registry.
                                    </td>
                                  </tr>
                                );
                              }
                              return filtered.map((emp) => {
                                const isSelected = selectedEmployeeId === emp.id;
                                return (
                                  <tr
                                    key={emp.id}
                                    onClick={() => setSelectedEmployeeId(emp.id)}
                                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors cursor-pointer ${
                                      isSelected ? "bg-slate-100/50 dark:bg-slate-800/40" : ""
                                    }`}
                                  >
                                    <td className="py-3 px-5 text-center">
                                      <input
                                        type="radio"
                                        name="selectedEmp"
                                        checked={isSelected}
                                        onChange={() => setSelectedEmployeeId(emp.id)}
                                        className="text-indigo-650"
                                      />
                                    </td>
                                    <td className="py-3 px-5 font-semibold">{emp.workshopId}</td>
                                    <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-200">{emp.firstName}</td>
                                    <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-200">{emp.lastName}</td>
                                    <td className="py-3 px-5 font-semibold text-slate-500">{emp.username}</td>
                                    <td className="py-3 px-5 font-medium text-slate-400">{emp.email || "—"}</td>
                                    <td className="py-3 px-5 font-bold">
                                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-[9px] font-black text-indigo-700 dark:text-indigo-400 uppercase">
                                        {emp.designation}
                                      </span>
                                    </td>
                                    <td className="py-3 px-5 font-semibold font-mono text-[10px] text-slate-400">{emp.pwdExpiry}</td>
                                    <td className="py-3 px-5 font-semibold">{emp.contact}</td>
                                    <td className="py-3 px-5 text-center">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleMobileAuth(emp.id);
                                        }}
                                        className={`px-2 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-wide transition-all active:scale-95 ${
                                          emp.mobileAuth
                                            ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                        }`}
                                      >
                                        {emp.mobileAuth ? "🟢 On" : "🔴 Off"}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination controller */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Displaying 1 to {employees.length} of {employees.length} employees
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            disabled
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-550 disabled:opacity-40"
                          >
                            Prev
                          </button>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-330 px-1">1 / 1</span>
                          <button
                            disabled
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-550 disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-550 bg-slate-50/30 dark:bg-slate-900/50 p-8">
                <Sliders className="h-12 w-12 text-slate-350 dark:text-slate-700 animate-pulse mb-3" />
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">{activeTab} Workspace</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm text-center">
                  This workspace module is currently integrated into the RAMP WMS backend ledger and will be populated dynamically. Select the <strong>Service Queue</strong> or <strong>Inventory</strong> to interact with active elements.
                </p>
              </div>
            )}

          </main>

        </div>

        {/* ============================================================ */}
        {/* 5. MODAL - NEW CUSTOMER REGISTRATION */}
        {/* ============================================================ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-500" />
                  <h2 className="text-lg font-black tracking-wide">New Customer & Vehicle Check-In</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleRegisterSubmit} className="flex flex-col h-[70vh]">
                <div className="p-6 flex flex-col md:flex-row gap-6 overflow-y-auto flex-1">
                  
                  {/* Column 1: Customer Details */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      Customer Context
                    </h3>
                    
                    {/* Name field */}
                    <div className="flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newCustomerForm.name}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                        placeholder="e.g. Aditya Pradhan"
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/80 transition-all font-semibold"
                      />
                    </div>

                    {/* Phone and alternate */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Mobile Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex">
                          <select className="px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs rounded-l-xl focus:outline-none font-bold">
                            <option>+91 (IN)</option>
                            <option>+1 (US)</option>
                          </select>
                          <input
                            type="tel"
                            required
                            value={newCustomerForm.phone}
                            onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                            placeholder="98765 43210"
                            className="w-full px-3.5 py-2.5 rounded-r-xl border-y border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Alternate No.
                        </label>
                        <input
                          type="tel"
                          value={newCustomerForm.altPhone}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, altPhone: e.target.value })}
                          placeholder="e.g. +91 900..."
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email & GSTIN */}
                    <div className="flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newCustomerForm.email}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                        placeholder="e.g. name@domain.com"
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      />
                    </div>

                    {/* Customer Source with Inline '+' Modal */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                          <span>Customer Source</span>
                          <button
                            type="button"
                            onClick={() => setIsNewSourceModalOpen(true)}
                            className="text-[10px] text-green-500 hover:text-green-600 font-extrabold"
                          >
                            + New
                          </button>
                        </label>
                        <select
                          value={newCustomerForm.source}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, source: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        >
                          {customerSources.map((src, i) => (
                            <option key={i} value={src}>{src}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Customer Type
                        </label>
                        <select
                          value={newCustomerForm.customerType}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customerType: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        >
                          <option value="individual">Individual</option>
                          <option value="corporate">Corporate (GST)</option>
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Billing Address
                      </label>
                      <textarea
                        rows={2}
                        value={newCustomerForm.address}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                        placeholder="Enter full address..."
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      />
                    </div>

                    {/* Technician & Supervisor with Inline Modals */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                          <span>Supervisor</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEmployeeRoleType("supervisor");
                              setIsNewEmployeeModalOpen(true);
                            }}
                            className="text-[9px] text-green-500 hover:text-green-600 font-bold"
                          >
                            + New
                          </button>
                        </label>
                        <select
                          value={newCustomerForm.supervisor}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, supervisor: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        >
                          {supervisorsList.map((sup, i) => (
                            <option key={i} value={sup}>{sup}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                          <span>Technician</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEmployeeRoleType("technician");
                              setIsNewEmployeeModalOpen(true);
                            }}
                            className="text-[9px] text-green-500 hover:text-green-600 font-bold"
                          >
                            + New
                          </button>
                        </label>
                        <select
                          value={newCustomerForm.technician}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, technician: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        >
                          {techniciansList.map((tech, i) => (
                            <option key={i} value={tech}>{tech}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Column 2: Vehicle details */}
                  <div className="flex-1 space-y-4 relative">
                    <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      Vehicle Context
                    </h3>

                    {/* Reg No & Odometer */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col relative">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Registration No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newCustomerForm.regNo}
                          onChange={handleRegNoChange}
                          placeholder="e.g. OD-05-AB-1234"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all uppercase font-mono font-bold tracking-wider"
                        />
                        {showRegSuggestions && (
                          <div className="absolute left-0 right-0 top-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 max-h-48 overflow-y-auto">
                            {matchingRegNoList.map((veh, idx) => (
                              <div
                                key={idx}
                                onClick={() => selectRegNoSuggestion(veh)}
                                className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-xs flex justify-between cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                              >
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-green-600 dark:text-green-400 font-mono tracking-wider">{veh.regNo}</span>
                                  <span className="text-[9px] text-slate-400 mt-0.5">{veh.name} • {veh.phone}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 self-center font-bold">{veh.brand} {veh.model}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Kilometer Driven
                        </label>
                        <input
                          type="number"
                          value={newCustomerForm.odometer}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, odometer: e.target.value })}
                          placeholder="e.g. 12450"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Brand & Model Search Typeahead dropdown */}
                    <div className="flex flex-col relative">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                        <span>Search Brand & Model *</span>
                        <button
                          type="button"
                          onClick={() => setIsNewVehicleModalOpen(true)}
                          className="text-[10px] text-green-500 hover:text-green-600 font-extrabold flex items-center space-x-0.5 bg-transparent border-0 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Custom Vehicle</span>
                        </button>
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={vehicleSearchText}
                          onChange={handleVehicleSearchChange}
                          placeholder="Type to search standard database..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                      </div>

                      {/* Suggestions list popup */}
                      {showVehicleSuggestions && (
                        <div className="absolute left-0 right-0 top-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 max-h-48 overflow-y-auto">
                          {MOCK_VEHICLE_DATABASE.filter(v =>
                            v.brand.toLowerCase().includes(vehicleSearchText.toLowerCase()) ||
                            v.model.toLowerCase().includes(vehicleSearchText.toLowerCase())
                          ).map((v, idx) => (
                            <div
                              key={idx}
                              onClick={() => selectVehicleSuggestion(v)}
                              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex justify-between cursor-pointer"
                            >
                              <span>{v.brand} {v.model}</span>
                              <span className="text-slate-400 text-[10px]">{v.category} • {v.variant}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Brand & Model Read-only details from typeahead selection */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Brand
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={newCustomerForm.brand}
                          placeholder="Auto-populated"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed focus:outline-none font-bold"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Model
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={newCustomerForm.model}
                          placeholder="Auto-populated"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed focus:outline-none font-bold"
                        />
                      </div>
                    </div>

                    {/* Vehicle variant & category */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Variant
                        </label>
                        <input
                          type="text"
                          value={newCustomerForm.variant}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, variant: e.target.value })}
                          placeholder="e.g. Standard"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                          <span>Vehicle Category *</span>
                          <button
                            type="button"
                            onClick={() => setIsNewCategoryModalOpen(true)}
                            className="text-[9px] text-green-500 hover:text-green-600 font-bold"
                          >
                            + New
                          </button>
                        </label>
                        <select
                          value={newCustomerForm.category}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, category: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        >
                          {vehicleCategories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Number Plate Color with Meaning Modal Trigger */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                          <span>Number Plate Color *</span>
                          <button
                            type="button"
                            onClick={() => setIsPlateInfoModalOpen(true)}
                            className="text-[9px] text-green-500 hover:text-green-600 font-extrabold flex items-center bg-transparent border-0 cursor-pointer"
                          >
                            <Info className="h-3 w-3 mr-0.5" /> Meaning
                          </button>
                        </label>
                        <select
                          value={newCustomerForm.plateColor}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, plateColor: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold"
                        >
                          <option value="white">White Plate (Private Vehicles)</option>
                          <option value="yellow">Yellow Plate (Commercial Vehicles)</option>
                          <option value="green">Green Plate (EVs Private)</option>
                          <option value="black">Black Plate (Rentals / Self-drive)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Manufactured Year
                        </label>
                        <input
                          type="number"
                          value={newCustomerForm.mfgYear}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, mfgYear: e.target.value })}
                          placeholder="e.g. 2025"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                        />
                      </div>
                    </div>

                    {/* Chassis VIN and Engine No */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Chassis Number / VIN
                        </label>
                        <input
                          type="text"
                          value={newCustomerForm.chassisNo}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, chassisNo: e.target.value })}
                          placeholder="e.g. MD2A..."
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono uppercase"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Engine Number
                        </label>
                        <input
                          type="text"
                          value={newCustomerForm.engineNo}
                          onChange={(e) => setNewCustomerForm({ ...newCustomerForm, engineNo: e.target.value })}
                          placeholder="e.g. JA05E..."
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono uppercase"
                        />
                      </div>
                    </div>

                    {/* Date Of Registration */}
                    <div className="flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Date Of Registration
                      </label>
                      <input
                        type="date"
                        value={newCustomerForm.regDate}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, regDate: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      />
                    </div>

                  </div>
                </div>

                {/* Action buttons at bottom */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-end space-x-3.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors shadow-md shadow-green-600/10 active:scale-95"
                  >
                    Register Customer
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUB-MODALS (INLINE CREATIONS) */}
        {/* ============================================================ */}
        
        {/* A. NEW VEHICLE MODAL */}
        {isNewVehicleModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wide">Add Custom Vehicle Model</h3>
                <button onClick={() => setIsNewVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-4 text-xs">
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Select Brand</label>
                  <select
                    value={newVehicleForm.brand}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, brand: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none font-semibold"
                  >
                    {vehicleBrandsList.map((b, i) => <option key={i} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle Model Name*</label>
                  <input
                    type="text"
                    required
                    value={newVehicleForm.model}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, model: e.target.value })}
                    placeholder="e.g. Activa Smart / R15M"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle Category</label>
                  <select
                    value={newVehicleForm.category}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, category: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
                  >
                    {vehicleCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Variant Name</label>
                  <input
                    type="text"
                    value={newVehicleForm.variant}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, variant: e.target.value })}
                    placeholder="e.g. Standard / H-Smart"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/60 flex justify-end space-x-2">
                <button onClick={() => setIsNewVehicleModalOpen(false)} className="px-3 py-2 rounded-lg text-slate-500 border border-slate-200 hover:bg-slate-100 text-[11px] font-bold">Cancel</button>
                <button
                  onClick={async () => {
                    if (!newVehicleForm.model) {
                      triggerToast("Please input model name!", "warn");
                      return;
                    }
                    try {
                      await fetch(`${API_BASE_URL}/vehicle-models`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                          brandId: "b1", 
                          name: newVehicleForm.model,
                          category: newVehicleForm.category,
                          variant: newVehicleForm.variant || "Standard"
                        })
                      });
                    } catch (e) {}
                    setNewCustomerForm(prev => ({
                      ...prev,
                      brand: newVehicleForm.brand,
                      model: newVehicleForm.model,
                      category: newVehicleForm.category,
                      variant: newVehicleForm.variant || "Standard"
                    }));
                    setVehicleSearchText(`${newVehicleForm.brand} ${newVehicleForm.model} - ${newVehicleForm.variant || "Standard"}`);
                    setIsNewVehicleModalOpen(false);
                    triggerToast(`Custom model ${newVehicleForm.model} created!`, "success");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold animate-pulse"
                >
                  Create Model
                </button>
              </div>
            </div>
          </div>
        )}

        {/* B. NEW CATEGORY MODAL */}
        {isNewCategoryModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wide">Add Custom Category</h3>
                <button onClick={() => setIsNewCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-3 text-xs">
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Category Name*</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Cargo EV / Trike"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/60 flex justify-end space-x-2">
                <button onClick={() => setIsNewCategoryModalOpen(false)} className="px-3 py-2 rounded-lg text-slate-500 border border-slate-200 text-[11px] font-bold">Cancel</button>
                <button
                  onClick={() => {
                    if (!newCategoryName.trim()) return;
                    setVehicleCategories([...vehicleCategories, newCategoryName]);
                    setNewCustomerForm(prev => ({ ...prev, category: newCategoryName }));
                    setIsNewCategoryModalOpen(false);
                    triggerToast(`Category ${newCategoryName} added!`, "success");
                    setNewCategoryName("");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* C. NEW SOURCE MODAL */}
        {isNewSourceModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wide">Add Referral Source</h3>
                <button onClick={() => setIsNewSourceModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-3 text-xs">
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Source Name*</label>
                  <input
                    type="text"
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g. Newspaper Ad / Instagram"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/60 flex justify-end space-x-2">
                <button onClick={() => setIsNewSourceModalOpen(false)} className="px-3 py-2 rounded-lg text-slate-500 border border-slate-200 text-[11px] font-bold">Cancel</button>
                <button
                  onClick={async () => {
                    if (!newSourceName.trim()) return;
                    try {
                      await fetch(`${API_BASE_URL}/customer-sources`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ name: newSourceName })
                      });
                    } catch (e) {}
                    setCustomerSources([...customerSources, newSourceName]);
                    setNewCustomerForm(prev => ({ ...prev, source: newSourceName }));
                    setIsNewSourceModalOpen(false);
                    triggerToast(`Referral source ${newSourceName} created!`, "success");
                    setNewSourceName("");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold"
                >
                  Create Source
                </button>
              </div>
            </div>
          </div>
        )}

        {/* D. NEW EMPLOYEE MODAL (TECHNICIAN / SUPERVISOR) */}
        {isNewEmployeeModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wide">
                  Create {employeeRoleType === "technician" ? "Technician" : "Advisor/Supervisor"}
                </h3>
                <button onClick={() => setIsNewEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-3 text-xs">
                <div className="flex flex-col">
                  <label className="font-bold text-slate-500 dark:text-slate-400 mb-1">Employee Full Name*</label>
                  <input
                    type="text"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    placeholder="e.g. Lingaraj Patra"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/60 flex justify-end space-x-2">
                <button onClick={() => setIsNewEmployeeModalOpen(false)} className="px-3 py-2 rounded-lg text-slate-500 border border-slate-200 text-[11px] font-bold">Cancel</button>
                <button
                  onClick={async () => {
                    if (!newEmployeeName.trim()) return;
                    try {
                      await fetch(`${API_BASE_URL}/employees`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ name: newEmployeeName, role: employeeRoleType })
                      });
                    } catch (e) {}
                    if (employeeRoleType === "technician") {
                      setTechniciansList([...techniciansList, newEmployeeName]);
                      setNewCustomerForm(prev => ({ ...prev, technician: newEmployeeName }));
                    } else {
                      setSupervisorsList([...supervisorsList, newEmployeeName]);
                      setNewCustomerForm(prev => ({ ...prev, supervisor: newEmployeeName }));
                    }
                    setIsNewEmployeeModalOpen(false);
                    triggerToast(`Employee ${newEmployeeName} added as ${employeeRoleType}!`, "success");
                    setNewEmployeeName("");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold animate-pulse"
                >
                  Save Employee
                </button>
              </div>
            </div>
          </div>
        )}

        {/* E. NUMBER PLATE INFO MODAL */}
        {isPlateInfoModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wide">Vehicle Number Plate Meanings</h3>
                <button onClick={() => setIsPlateInfoModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">In India, the color combination of a vehicle&apos;s number plate signifies the vehicle&apos;s usage type and fuel configuration. Here is the operational context:</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                    <span className="h-6 w-14 rounded border border-slate-300 bg-white text-slate-900 font-mono text-[9px] font-black text-center pt-1 shadow-sm shrink-0">OD-05</span>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-white">White Plate (Black Letters)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Private Petrol/Diesel vehicles. Strictly for personal/private transport.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                    <span className="h-6 w-14 rounded border border-yellow-300 bg-yellow-400 text-slate-900 font-mono text-[9px] font-black text-center pt-1 shadow-sm shrink-0">OD-05</span>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-white">Yellow Plate (Black Letters)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Commercial transport vehicles (cabs, freight, public services).</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                    <span className="h-6 w-14 rounded border border-green-400 bg-green-500 text-white font-mono text-[9px] font-black text-center pt-1 shadow-sm shrink-0">OD-05</span>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-white">Green Plate (White Letters)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Electric Vehicles (EVs) registered for personal/private category.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                    <span className="h-6 w-14 rounded border border-slate-800 bg-slate-900 text-yellow-400 font-mono text-[9px] font-black text-center pt-1 shadow-sm shrink-0">OD-05</span>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-white">Black Plate (Yellow Letters)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Self-drive rental cars/bikes or commercial luxury hotel fleets.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/60 flex justify-end">
                <button onClick={() => setIsPlateInfoModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-extrabold text-[11px] cursor-pointer">Got it</button>
              </div>
            </div>
          </div>
        )}

        {/* F. POST-REGISTRATION SUCCESS OVERLAY DIALOG */}
        {isSuccessOverlayOpen && savedJobCardDetails && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 p-6 text-center space-y-6">
              
              {/* Pulsing check circle icon */}
              <div className="mx-auto h-20 w-20 rounded-full bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 flex items-center justify-center animate-pulse">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>

              {/* Status details */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wide">Vehicle Details Saved Successfully</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Registered customer <span className="font-bold text-slate-850 dark:text-white">{savedJobCardDetails.customerName}</span> with active vehicle no <span className="font-mono font-bold text-green-600 dark:text-green-400">{savedJobCardDetails.vehicleNo}</span>.
                </p>
              </div>

              {/* Job Card summary grid */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-xs text-left space-y-2.5 font-semibold">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Job Card Number:</span>
                  <span className="font-mono text-green-500">{savedJobCardDetails.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Assigned Advisor:</span>
                  <span className="text-slate-800 dark:text-slate-200">{savedJobCardDetails.advisor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Default Service Type:</span>
                  <span className="text-slate-800 dark:text-slate-200">{savedJobCardDetails.serviceType}</span>
                </div>
              </div>

              {/* CTA Action buttons */}
              <div className="flex flex-col space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setIsSuccessOverlayOpen(false);
                    setIsModalOpen(false);
                    router.push(`/estimation/${savedJobCardId}`);
                  }}
                  className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs shadow-lg shadow-green-600/10 hover:shadow-green-700/20 active:scale-95 transition-all uppercase tracking-wider"
                >
                  Go to Estimation
                </button>
                <button
                  onClick={() => {
                    setIsSuccessOverlayOpen(false);
                    setIsModalOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - REGISTER NEW SPARE PART */}
        {/* ============================================================ */}
        {isAddPartModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Register New Spare Part</h3>
                </div>
                <button
                  onClick={() => setIsAddPartModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-750"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePart} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">Part Name *</label>
                    <input
                      type="text"
                      required
                      value={addPartForm.name}
                      onChange={(e) => setAddPartForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Rear Shock Absorber"
                      className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">OEM Part Number *</label>
                    <input
                      type="text"
                      required
                      value={addPartForm.partNo}
                      onChange={(e) => setAddPartForm(p => ({ ...p, partNo: e.target.value }))}
                      placeholder="e.g. SP-ABS-88"
                      className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">Dealer Cost Price *</label>
                    <input
                      type="number"
                      required
                      value={addPartForm.price}
                      onChange={(e) => setAddPartForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="e.g. 1500"
                      className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">Retail MRP *</label>
                    <input
                      type="number"
                      required
                      value={addPartForm.mrp}
                      onChange={(e) => setAddPartForm(p => ({ ...p, mrp: e.target.value }))}
                      placeholder="e.g. 1750"
                      className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">Min Threshold *</label>
                    <input
                      type="number"
                      required
                      value={addPartForm.minStock}
                      onChange={(e) => setAddPartForm(p => ({ ...p, minStock: e.target.value }))}
                      placeholder="e.g. 5"
                      className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">Category</label>
                    <select
                      value={addPartForm.category}
                      onChange={(e) => setAddPartForm(p => ({ ...p, category: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      <option value="General">General</option>
                      <option value="Brakes">Brakes</option>
                      <option value="Fluids">Fluids</option>
                      <option value="Electricals">Electricals</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Engine">Engine</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1">Supplier OEM</label>
                    <input
                      type="text"
                      value={addPartForm.supplier}
                      onChange={(e) => setAddPartForm(p => ({ ...p, supplier: e.target.value }))}
                      placeholder="e.g. Gabriel India"
                      className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsAddPartModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs"
                  >
                    Register Part Card
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - CREATE NEW DESIGNATION */}
        {/* ============================================================ */}
        {isNewDesignationOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Create New Designation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewDesignationOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddDesignation} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Designation Name *</label>
                  <input
                    type="text"
                    required
                    value={designationForm}
                    onChange={(e) => setDesignationForm(e.target.value)}
                    placeholder="Enter Designation (e.g. Supervisor)"
                    className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsNewDesignationOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Save Designation
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - EDIT DESIGNATION */}
        {/* ============================================================ */}
        {isEditDesignationOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Edit Designation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditDesignationOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleEditDesignation} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Designation Name *</label>
                  <input
                    type="text"
                    required
                    value={designationForm}
                    onChange={(e) => setDesignationForm(e.target.value)}
                    placeholder="Enter Designation"
                    className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                  />
                  <div className="mt-2 text-[10px] text-slate-400 font-semibold flex items-center space-x-1.5">
                    <span>Editing Designation ID Info:</span>
                    <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded text-slate-500">
                      {designations.indexOf(selectedDesignation) !== -1 ? designations.indexOf(selectedDesignation) + 1 : 7}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsEditDesignationOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - REGISTER NEW EMPLOYEE */}
        {/* ============================================================ */}
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Register New Employee</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Workshop Branch *</label>
                    <select
                      value={employeeForm.workshopId}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, workshopId: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      <option value="Bike Masters">Bike Masters</option>
                      <option value="Raghunathpur BM">Raghunathpur BM</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Designation *</label>
                    <select
                      value={employeeForm.designation}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, designation: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      {designations.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">First Name *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.firstName}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="Enter First Name"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.lastName}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Enter Last Name"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Username *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.username}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, username: e.target.value }))}
                      placeholder="Login Username (e.g. UTTAM)"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Contact Number *</label>
                    <input
                      type="tel"
                      required
                      value={employeeForm.contact}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, contact: e.target.value }))}
                      placeholder="10-digit Mobile Number"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password *</label>
                    <input
                      type="password"
                      required
                      defaultValue="••••••••"
                      placeholder="Enter Login Password"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={employeeForm.pwdExpiry}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, pwdExpiry: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email ID (Optional)</label>
                    <input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="e.g. name@domain.com"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      value={employeeForm.dob}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, dob: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Anniversary Date</label>
                    <input
                      type="date"
                      value={employeeForm.anniversary}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, anniversary: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Address</label>
                  <input
                    type="text"
                    value={employeeForm.address}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Enter Employee Address"
                    className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Save Employee
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - EDIT EMPLOYEE PROFILE */}
        {/* ============================================================ */}
        {isEditEmployeeOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Edit Employee Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditEmployeeOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleEditEmployee} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Workshop Branch *</label>
                    <select
                      value={employeeForm.workshopId}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, workshopId: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      <option value="Bike Masters">Bike Masters</option>
                      <option value="Raghunathpur BM">Raghunathpur BM</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Designation *</label>
                    <select
                      value={employeeForm.designation}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, designation: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      {designations.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">First Name *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.firstName}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="Enter First Name"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.lastName}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Enter Last Name"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Username *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.username}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, username: e.target.value }))}
                      placeholder="Login Username"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold font-mono"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Contact Number *</label>
                    <input
                      type="tel"
                      required
                      value={employeeForm.contact}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, contact: e.target.value }))}
                      placeholder="10-digit Mobile Number"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password (Read-Only Hashed)</label>
                    <input
                      type="text"
                      disabled
                      value="$2y$10$... (Encrypted Cryptographic Hash)"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-mono cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={employeeForm.pwdExpiry}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, pwdExpiry: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email ID</label>
                    <input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="e.g. name@domain.com"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      value={employeeForm.dob}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, dob: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Anniversary Date</label>
                    <input
                      type="date"
                      value={employeeForm.anniversary}
                      onChange={(e) => setEmployeeForm(p => ({ ...p, anniversary: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Address</label>
                  <input
                    type="text"
                    value={employeeForm.address}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Enter Employee Address"
                    className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsEditEmployeeOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - ASSIGN USER ROLE */}
        {/* ============================================================ */}
        {isAddRoleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Assign User Role</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddRoleCode} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Employee Name</label>
                  <input
                    type="text"
                    disabled
                    value={`${employees.find(e => e.id === selectedEmployeeId)?.firstName} ${employees.find(e => e.id === selectedEmployeeId)?.lastName}`}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Role Code *</label>
                  <select
                    value={roleForm.roleCode}
                    onChange={(e) => setRoleForm({ roleCode: e.target.value })}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                  >
                    <option value="Admin">Admin (Access System Configuration)</option>
                    <option value="Buttons">Buttons (View / Action Dashboard Triggers)</option>
                    <option value="Executive">Executive (Generate Reports / Manage CRM)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsAddRoleModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Assign Role Code
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - GRANT GRANULAR PERMISSION */}
        {/* ============================================================ */}
        {isAddPermissionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Grant Granular Permission</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPermissionModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddPermission} className="p-6 space-y-4 text-xs text-slate-900 dark:text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Employee Name</label>
                    <input
                      type="text"
                      disabled
                      value={`${employees.find(e => e.id === selectedEmployeeId)?.firstName} ${employees.find(e => e.id === selectedEmployeeId)?.lastName}`}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Widget Type *</label>
                    <select
                      value={permissionForm.widgetType}
                      onChange={(e) => setPermissionForm(p => ({ ...p, widgetType: e.target.value as any }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      <option value="Button">Button (B)</option>
                      <option value="Menu">Menu (M)</option>
                      <option value="Page">Page</option>
                      <option value="Tab">Tab</option>
                    </select>
                  </div>
                </div>

                {permissionForm.widgetType === "Button" ? (
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Button / Action Widget Name *</label>
                    <select
                      value={permissionForm.widgetName}
                      onChange={(e) => setPermissionForm(p => ({ ...p, widgetName: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                    >
                      <option value="EstimationButton">EstimationButton</option>
                      <option value="ReadyButton">ReadyButton</option>
                      <option value="InvoiceButton">InvoiceButton</option>
                      <option value="DiscountButton">DiscountButton</option>
                      <option value="PaymentButton">PaymentButton</option>
                      <option value="CustomerSource">CustomerSource</option>
                      <option value="ViewHistory">ViewHistory</option>
                      <option value="EditProfile">EditProfile</option>
                      <option value="InsuranceDetails">InsuranceDetails</option>
                      <option value="ReferVendor">ReferVendor</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Menu Option Dropdown *</label>
                        <select
                          value={permissionForm.menuOption}
                          onChange={(e) => {
                            const option = e.target.value;
                            let header = "Workshop";
                            let link = "workshop/display";
                            if (option.includes("Report")) {
                              header = "Reports";
                              link = "workshop/businessReports";
                            } else if (option.includes("Insurance")) {
                              header = "Reports";
                              link = "workshop/insurancePolicies";
                            } else if (option.includes("Employee") || option.includes("Designation")) {
                              header = "Manage Users";
                              link = "workshop/manageEmployees";
                            } else if (option.includes("Spares") || option.includes("Brand") || option.includes("Model") || option.includes("Tax") || option.includes("Terms")) {
                              header = "System Configuration";
                              link = "workshop/manageSparesMaster";
                            }
                            setPermissionForm(p => ({ ...p, menuOption: option, menuHeader: header, menuLink: link }));
                          }}
                          className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                        >
                          <option value="Business Reports">Business Reports</option>
                          <option value="Customer Reports">Customer Reports</option>
                          <option value="By Spares & Services">By Spares & Services</option>
                          <option value="Upcoming Services">Upcoming Services</option>
                          <option value="Manage Services">Manage Services</option>
                          <option value="Manage Employees">Manage Employees</option>
                          <option value="Manage Designations">Manage Designations</option>
                          <option value="Manage Spares Master">Manage Spares Master</option>
                          <option value="Manage Vehicle Models">Manage Vehicle Models</option>
                          <option value="View Service History">View Service History</option>
                          <option value="Manage Insurance Provider">Manage Insurance Provider</option>
                          <option value="Manage Terms n Conditions">Manage Terms n Conditions</option>
                          <option value="Manage Tax Rates / HSN Code">Manage Tax Rates / HSN Code</option>
                          <option value="Manage Insurance Status Info">Manage Insurance Status Info</option>
                          <option value="By Stock In/Out Reports">By Stock In/Out Reports</option>
                          <option value="Report By Invoices">Report By Invoices</option>
                          <option value="GST Filing Reports">GST Filing Reports</option>
                          <option value="Manage Counter Sales">Manage Counter Sales</option>
                          <option value="Inventory Management">Inventory Management</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Menu Header *</label>
                        <input
                          type="text"
                          required
                          value={permissionForm.menuHeader}
                          onChange={(e) => setPermissionForm(p => ({ ...p, menuHeader: e.target.value }))}
                          placeholder="e.g. Manage Users"
                          className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Menu Access Link / URL Path *</label>
                      <input
                        type="text"
                        required
                        value={permissionForm.menuLink}
                        onChange={(e) => setPermissionForm(p => ({ ...p, menuLink: e.target.value }))}
                        placeholder="e.g. workshop/manageEmployees"
                        className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Permissions Level *</label>
                  <select
                    value={permissionForm.permissionLevel}
                    onChange={(e) => setPermissionForm(p => ({ ...p, permissionLevel: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                  >
                    {permissionForm.widgetType === "Button" ? (
                      <option value="show">show (Visible in UX)</option>
                    ) : (
                      <>
                        <option value="CRUD">CRUD (Full Access: Create, Read, Update, Delete)</option>
                        <option value="Create">Create</option>
                        <option value="Read">Read</option>
                        <option value="Update">Update</option>
                        <option value="Delete">Delete</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsAddPermissionModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Grant Access Rules
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - VIEW DESIGNATION DETAILS */}
        {/* ============================================================ */}
        {isViewDesignationOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-250">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-teal-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">View Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsViewDesignationOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-350">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 space-y-3 font-semibold">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Designation Info Id</span>
                    <span className="font-mono text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                      {designations.indexOf(selectedDesignation) !== -1 ? designations.indexOf(selectedDesignation) + 1 : 7}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Designation</span>
                    <span className="text-slate-900 dark:text-white font-extrabold uppercase bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 px-2.5 py-0.5 rounded-full text-[10px]">
                      {selectedDesignation}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast("Initiating Secure PDF Print Ledger...", "success");
                      setTimeout(() => window.print(), 500);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                  >
                    Print/Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsViewDesignationOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL - VIEW EMPLOYEE DETAILS */}
        {/* ============================================================ */}
        {isViewEmployeeOpen && (() => {
          const emp = employees.find(e => e.id === selectedEmployeeId);
          if (!emp) return null;
          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-250">
                
                <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-teal-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">View Details (Employee)</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsViewEmployeeOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Horizontal Premium Segmented Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10">
                  <button
                    onClick={() => setViewEmployeeActiveSubTab("profile")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 ${
                      viewEmployeeActiveSubTab === "profile"
                        ? "border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800/50 shadow-sm"
                        : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-900/20"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Details</span>
                  </button>
                  <button
                    onClick={() => setViewEmployeeActiveSubTab("permissions")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 ${
                      viewEmployeeActiveSubTab === "permissions"
                        ? "border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800/50 shadow-sm"
                        : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-900/20"
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Access Permissions</span>
                  </button>
                </div>

                <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-350">
                  
                  {/* TAB 1: Profile Details */}
                  {viewEmployeeActiveSubTab === "profile" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 font-semibold">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Employee Id</span>
                            <span className="font-mono text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                              {emp.id}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Workshop Id</span>
                            <span className="text-slate-800 dark:text-white">{emp.workshopId}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">First Name</span>
                            <span className="text-slate-800 dark:text-white font-bold">{emp.firstName}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Name</span>
                            <span className="text-slate-800 dark:text-white font-bold">{emp.lastName}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Designation</span>
                            <span className="text-slate-900 dark:text-white font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded text-[9px]">
                              {emp.designation}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">User Name</span>
                            <span className="text-slate-800 dark:text-white font-mono">{emp.username}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</span>
                            <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px] truncate max-w-[140px]">$2y$10$... (hashed)</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pswd Expiry Date</span>
                            <span className="font-mono text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">{emp.pwdExpiry}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Number</span>
                            <span className="text-slate-800 dark:text-white font-bold">{emp.contact}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date Of Birth</span>
                            <span className="text-slate-800 dark:text-white font-mono">{emp.dob || "0000-00-00"}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date Of Anniversary</span>
                            <span className="text-slate-800 dark:text-white font-mono">{emp.anniversary || "0000-00-00"}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address</span>
                            <span className="text-slate-800 dark:text-white truncate max-w-[140px]">{emp.address || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                            <span className="text-green-700 dark:text-green-400 font-extrabold uppercase text-[9px] bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded">ACTIVE</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Wrkshopname</span>
                            <span className="text-slate-800 dark:text-white">Bike Masters</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Access Permissions */}
                  {viewEmployeeActiveSubTab === "permissions" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Roles */}
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">Assigned Security Roles</span>
                          <div className="flex flex-wrap gap-2">
                            {userRoles.filter(r => r.employeeId === emp.id).map(r => (
                              <span key={r.roleName} className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                                {r.roleName}
                              </span>
                            ))}
                            {userRoles.filter(r => r.employeeId === emp.id).length === 0 && (
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">No security roles assigned.</span>
                            )}
                          </div>
                        </div>

                        {/* Permissions Count */}
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">Granular Rule Declarations</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-black text-slate-850 dark:text-white">
                              {userPermissions.filter(p => p.employeeId === emp.id).length} Active Rules
                            </span>
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Permissions list dropdown/scroll block */}
                      {userPermissions.filter(p => p.employeeId === emp.id).length > 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/65 overflow-hidden">
                          <div className="px-4 py-3 bg-slate-100 dark:bg-slate-850/50 border-b border-slate-200/50 dark:border-slate-800/60 text-[10px] uppercase font-black text-slate-500 tracking-wider flex items-center justify-between">
                            <span>Menu & Button Access Rights Matrix</span>
                            <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-full border border-teal-100 dark:border-teal-900/30">Live Sync</span>
                          </div>
                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/65 p-4 space-y-2">
                            {userPermissions.filter(p => p.employeeId === emp.id).map((perm, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] py-1.5 font-semibold">
                                <div className="flex items-center space-x-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                    perm.widgetType === "Button" 
                                      ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30"
                                      : "bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                  }`}>
                                    {perm.widgetType}
                                  </span>
                                  <span className="text-slate-850 dark:text-slate-250">
                                    {perm.widgetType === "Button" ? perm.widgetName : `${perm.menuHeader} > ${perm.menuOption}`}
                                  </span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                  perm.permissions === "CRUD" ? "bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900/30" : "bg-blue-150 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30"
                                }`}>
                                  {perm.permissions}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-450 dark:text-slate-500 font-medium">
                          No granular menu or button permissions defined for this employee. Access is inherited from designated group policy.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700/60 font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast(`Initiating Secure PDF Print Ledger for ${emp.firstName} ${emp.lastName}...`, "success");
                        setTimeout(() => window.print(), 500);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors shadow-sm text-xs font-bold"
                    >
                      Print/Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsViewEmployeeOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-750 dark:text-slate-200 rounded-xl transition-colors text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* MODAL - SECURITY ROLES & GRANULAR PERMISSIONS */}
        {/* ============================================================ */}
        {isAccessPanelOpen && (() => {
          const emp = employees.find(e => e.id === selectedEmployeeId);
          if (!emp) return null;
          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-250 flex flex-col max-h-[85vh]">
                
                {/* Access Panel Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 shrink-0">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Permissions Manager: {emp.firstName} {emp.lastName}
                    </h3>
                    <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="hidden sm:inline-block font-mono text-slate-400 dark:text-slate-500 text-[10px]">ID: {emp.id}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAccessPanelOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Navigation Tab bar for Access control */}
                <div className="border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between px-6 bg-slate-550/5 dark:bg-slate-900/20 shrink-0">
                  <div className="flex space-x-6 text-xs">
                    <button
                      onClick={() => setActivePermissionsTab("roles")}
                      className={`py-3.5 font-bold uppercase tracking-wider border-b-2 transition-all ${
                        activePermissionsTab === "roles" ? "border-green-500 text-slate-900 dark:text-white font-extrabold" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600"
                      }`}
                    >
                      1. Roles
                    </button>
                    <button
                      onClick={() => setActivePermissionsTab("permissions")}
                      className={`py-3.5 font-bold uppercase tracking-wider border-b-2 transition-all ${
                        activePermissionsTab === "permissions" ? "border-green-500 text-slate-900 dark:text-white font-extrabold" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600"
                      }`}
                    >
                      2. Granular Permissions
                    </button>
                  </div>

                  {activePermissionsTab === "roles" ? (
                    <button
                      onClick={() => setIsAddRoleModalOpen(true)}
                      className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[9px] uppercase tracking-wide px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm font-bold"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      <span>Assign Role</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAddPermissionModalOpen(true)}
                      className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-[9px] uppercase tracking-wide px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm font-bold"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      <span>Assign Rule</span>
                    </button>
                  )}
                </div>

                {/* Permissions main content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/30 dark:bg-slate-900/20">
                  {activePermissionsTab === "roles" ? (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-x-auto shadow-sm max-w-2xl mx-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                            <th className="py-4 px-5 w-20 text-center">Manage</th>
                            <th className="py-4 px-5">Employee Name</th>
                            <th className="py-4 px-5">Assigned Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {userRoles.filter(r => r.employeeId === selectedEmployeeId).map((role, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                              <td className="py-3 px-5 text-center">
                                <button
                                  onClick={() => handleDeleteUserRole(role.roleName)}
                                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                              <td className="py-3 px-5 font-bold">
                                {emp.firstName} {emp.lastName}
                              </td>
                              <td className="py-3 px-5">
                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                                  {role.roleName}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {userRoles.filter(r => r.employeeId === selectedEmployeeId).length === 0 && (
                            <tr>
                              <td colSpan={3} className="py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                                No security roles currently assigned.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-x-auto shadow-sm">
                      <table className="min-w-[900px] w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                            <th className="py-4 px-5 w-12 text-center">Manage</th>
                            <th className="py-4 px-5">Employee Name</th>
                            <th className="py-4 px-5">Role Code</th>
                            <th className="py-4 px-5">Widget Type</th>
                            <th className="py-4 px-5">Widget/Button Name</th>
                            <th className="py-4 px-5">Menu Header</th>
                            <th className="py-4 px-5">Menu Option</th>
                            <th className="py-4 px-5">Permissions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {userPermissions.filter(p => p.employeeId === selectedEmployeeId).map((perm, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350 transition-colors">
                              <td className="py-3 px-5 text-center">
                                <button
                                  onClick={() => handleDeletePermission(perm.id)}
                                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                              <td className="py-3 px-5 font-bold">
                                {emp.firstName} {emp.lastName}
                              </td>
                              <td className="py-3 px-5 font-semibold text-slate-550 dark:text-slate-400">{perm.roleCode}</td>
                              <td className="py-3 px-5 text-center">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase">{perm.widgetType}</span>
                              </td>
                              <td className="py-3 px-5 font-mono text-[10px] text-slate-400 dark:text-slate-500">{perm.widgetName || "-"}</td>
                              <td className="py-3 px-5 font-bold text-slate-850 dark:text-slate-200">{perm.menuHeader || "-"}</td>
                              <td className="py-3 px-5 font-medium">{perm.menuOption || "-"}</td>
                              <td className="py-3 px-5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  perm.permissions === "CRUD" ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                                }`}>
                                  {perm.permissions}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {userPermissions.filter(p => p.employeeId === selectedEmployeeId).length === 0 && (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                No granular rules defined for this employee.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-900/30 shrink-0 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsAccessPanelOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-750 dark:hover:bg-slate-700 text-white dark:text-slate-200 rounded-xl transition-colors text-xs shadow-sm active:scale-95"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* DYNAMIC SYSTEM CONFIGURATION CRUD MODAL */}
        {/* ============================================================ */}
        {isCrudModalOpen && (() => {
          const schema = getCrudSchema(activeTab);
          const title = `${crudModalMode === "new" ? "New" : crudModalMode === "edit" ? "Edit" : "View"} ${activeTab}`;
          
          const handleSaveCrud = (e: React.FormEvent) => {
            e.preventDefault();
            // Validate required fields
            for (const f of schema) {
              if (f.required && !crudForm[f.name]) {
                triggerToast(`${f.label} is required!`, "warn");
                return;
              }
            }

            // Choose correct state and setter
            let list: any[] = [];
            let setList: any = null;

            switch (activeTab) {
              case "Brandwise Consumables":
                list = brandwiseConsumables;
                setList = setBrandwiseConsumables;
                break;
              case "Consumable Brands":
                list = consumableBrandsList;
                setList = setConsumableBrandsList;
                break;
              case "Customer Source":
                list = customerSourcesList;
                setList = setCustomerSourcesList;
                break;
              case "Insurance Provider":
                list = insuranceProvidersList;
                setList = setInsuranceProvidersList;
                break;
              case "Spares Master":
                list = sparesMasterList;
                setList = setSparesMasterList;
                break;
              case "Vehicle Category":
                list = vehicleCategoriesList;
                setList = setVehicleCategoriesList;
                break;
              case "Vehicle Models":
                list = vehicleModelsList;
                setList = setVehicleModelsList;
                break;
              case "Workshop Info":
                list = workshopBranches;
                setList = setWorkshopBranches;
                break;
              case "Manage Services":
                list = servicesList;
                setList = setServicesList;
                break;
              default:
                break;
            }

            if (setList) {
              if (activeTab === "Manage Services") {
                const saveService = async () => {
                  try {
                    const method = crudModalMode === "new" ? "POST" : "PATCH";
                    const url = crudModalMode === "new" ? `${API_BASE_URL}/services-master` : `${API_BASE_URL}/services-master/${crudSelectedId}`;
                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(crudForm)
                    });
                    if (res.ok) {
                      const saved = await res.json();
                      const mapped = {
                        id: saved.id,
                        name: saved.name,
                        category: saved.category || "General",
                        code: saved.code,
                        amount: saved.rate
                      };
                      if (crudModalMode === "new") {
                        setList([...list, mapped]);
                        triggerToast("Service added successfully!", "success");
                      } else {
                        setList(list.map((item: any) => (item.id === crudSelectedId ? mapped : item)));
                        triggerToast("Service updated successfully!", "success");
                      }
                    }
                  } catch (err) {
                    console.error("Failed to save service", err);
                    triggerToast("Backend offline, updating locally", "warn");
                    // Fallback local update
                    if (crudModalMode === "new") {
                      setList([...list, { id: "sv" + Date.now(), ...crudForm }]);
                    } else {
                      setList(list.map((item: any) => (item.id === crudSelectedId ? { ...item, ...crudForm } : item)));
                    }
                  }
                };
                saveService();
              } else {
                if (crudModalMode === "new") {
                  const newRec = {
                    id: activeTab === "Workshop Info" ? (crudForm.id || Math.random().toString()) : (activeTab.slice(0, 2).toLowerCase() + Date.now()),
                    ...crudForm
                  };
                  setList([...list, newRec]);
                  triggerToast("Record added successfully!", "success");
                } else {
                  setList(list.map((item: any) => (item.id === crudSelectedId ? { ...item, ...crudForm } : item)));
                  triggerToast("Record updated successfully!", "success");
                }
              }
            }

            setIsCrudModalOpen(false);
          };

          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                  <h2 className="text-lg font-black tracking-wide text-slate-800 dark:text-white uppercase">{title}</h2>
                  <button
                    onClick={() => setIsCrudModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveCrud} className="p-6 space-y-4">
                  {schema.map((f) => (
                    <div key={f.name} className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {crudModalMode === "view" ? (
                        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350">
                          {crudForm[f.name]?.toString() || "—"}
                        </div>
                      ) : f.type === "select" ? (
                        <select
                          value={crudForm[f.name] || ""}
                          onChange={(e) => setCrudForm({ ...crudForm, [f.name]: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold text-slate-800 dark:text-slate-200"
                        >
                          {f.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          value={crudForm[f.name] || ""}
                          onChange={(e) => setCrudForm({ ...crudForm, [f.name]: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-350 dark:focus:ring-slate-700 font-semibold text-slate-800 dark:text-slate-200"
                        />
                      )}
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsCrudModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-xs font-bold active:scale-95"
                    >
                      {crudModalMode === "view" ? "Close" : "Cancel"}
                    </button>
                    {crudModalMode !== "view" && (
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl transition-colors text-xs font-extrabold active:scale-95"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* STATUS CHANGE MODAL */}
        {/* ============================================================ */}
        {isStatusModalOpen && selectedJob && (() => {
          const WORKFLOW_STATUSES = [
            {
              key: "Client Agreed",
              icon: "✅",
              color: "emerald",
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
              border: "border-emerald-400",
              text: "text-emerald-700 dark:text-emerald-300",
              dot: "bg-emerald-500",
              desc: "Customer has reviewed and agreed to the estimation",
            },
            {
              key: "Work in Progress",
              icon: "🔧",
              color: "blue",
              bg: "bg-blue-50 dark:bg-blue-950/30",
              border: "border-blue-400",
              text: "text-blue-700 dark:text-blue-300",
              dot: "bg-blue-500",
              desc: "Technician is actively working on the vehicle",
            },
            {
              key: "Work on Hold",
              icon: "⏸️",
              color: "amber",
              bg: "bg-amber-50 dark:bg-amber-950/30",
              border: "border-amber-400",
              text: "text-amber-700 dark:text-amber-300",
              dot: "bg-amber-500",
              desc: "Work paused — awaiting parts, approval, or customer decision",
            },
            {
              key: "Work Completed",
              icon: "🏁",
              color: "teal",
              bg: "bg-teal-50 dark:bg-teal-950/30",
              border: "border-teal-400",
              text: "text-teal-700 dark:text-teal-300",
              dot: "bg-teal-500",
              desc: "All repair/service work has been completed",
            },
            {
              key: "Out for Delivery",
              icon: "🛵",
              color: "violet",
              bg: "bg-violet-50 dark:bg-violet-950/30",
              border: "border-violet-400",
              text: "text-violet-700 dark:text-violet-300",
              dot: "bg-violet-500",
              desc: "Vehicle dispatched or on its way to the customer",
            },
            {
              key: "Delivered",
              icon: "🎉",
              color: "green",
              bg: "bg-green-50 dark:bg-green-950/30",
              border: "border-green-500",
              text: "text-green-700 dark:text-green-300",
              dot: "bg-green-600",
              desc: "Vehicle handed over to the customer successfully",
            },
          ];
          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-wide">Update Job Status</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedJob.id} · {selectedJob.vehicleNo} · {selectedJob.customerName}</p>
                  </div>
                  <button onClick={() => setIsStatusModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Status grid */}
                <div className="p-5 space-y-2 max-h-[55vh] overflow-y-auto">
                  {WORKFLOW_STATUSES.map((s) => {
                    const isActive = selectedStatus === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setSelectedStatus(s.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${isActive ? `${s.bg} ${s.border}` : "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500"}`}
                      >
                        <span className="text-xl shrink-0">{s.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-black ${isActive ? s.text : "text-slate-700 dark:text-slate-200"}`}>{s.key}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{s.desc}</div>
                        </div>
                        {isActive && (
                          <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.dot}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Note field */}
                <div className="px-5 pb-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Note (optional)</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={e => setStatusNote(e.target.value)}
                    placeholder="e.g. Waiting for clutch plate delivery..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
                  <button onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                  <button
                    onClick={handleSaveStatus}
                    disabled={!selectedStatus || selectedStatus === selectedJob.status}
                    className="px-5 py-2 text-xs font-black text-white bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* PAYMENT DETAILS MODAL */}
        {/* ============================================================ */}
        {isPaymentModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex-1 text-center">
                  <h3 className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Edit Payment Details</h3>
                  <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center space-x-3 mt-1">
                    <span>Order Id: {selectedJob.id.split('-').pop()}</span>
                    <span>|</span>
                    <span>Total Amount (incl. GST): Rs. {Math.round(selectedJob.estimate * 1.18)}</span>
                    <span>|</span>
                    <span>Total Discount: Rs. {selectedJob.overallDiscount || 0}</span>
                    <span>|</span>
                    <span>Total Paid: Rs. {selectedJob.paid}</span>
                    <span>|</span>
                    <span>Total Due: Rs. {Math.max(0, Math.round(selectedJob.estimate * 1.18) - selectedJob.paid)}</span>
                  </div>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="text-red-500 hover:scale-110 transition-transform"><X className="h-5 w-5" /></button>
              </div>

              {(() => {
                const gstRate = 0.18;
                const baseAmount = selectedJob.estimate;
                const gstAmount = Math.round(baseAmount * gstRate);
                const totalWithGst = baseAmount + gstAmount;
                const enteredPaid = Number(paymentForm.card) + Number(paymentForm.cash) + Number(paymentForm.cheque) + Number(paymentForm.other);
                const totalPaidSoFar = selectedJob.paid + enteredPaid;
                const totalDue = Math.max(0, totalWithGst - totalPaidSoFar);
                return (
                  <div className="p-6 space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">To Be Paid By Customer (incl. GST {(gstRate*100).toFixed(0)}%) :</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white">Rs. {totalWithGst}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">Total Paid By Customer :</span>
                        <span className="text-xs font-black text-teal-600 dark:text-teal-400">Rs. {totalPaidSoFar}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">Total Due From Customer :</span>
                        <span className={`text-xs font-black ${totalDue > 0 ? 'text-red-500' : 'text-green-600'}`}>Rs. {totalDue}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {['Card', 'Cash', 'Cheque', 'Other'].map((mode) => (
                        <React.Fragment key={mode}>
                          <div className="flex items-center bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-xl px-4 py-2">
                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Paid By {mode}</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, [mode.toLowerCase()]: Number(e.target.value) || 0 }))}
                          />
                          <input
                            type="text"
                            placeholder="Enter remarks"
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, remarks: e.target.value }))}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">Terms and Conditions</button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSavePayment}
                    className="px-8 py-2 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl font-black text-xs hover:bg-green-200 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleSavePayment}
                    className="px-8 py-2 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-black text-xs hover:bg-red-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* INVOICE PREVIEW MODAL */}
        {/* ============================================================ */}
        {isInvoiceModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex-1 text-center">
                  <h3 className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Tax Invoice Preview</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">JC: {selectedJob.id} | {selectedJob.vehicleNo} | {selectedJob.brandModel}</p>
                </div>
                <button onClick={() => setIsInvoiceModalOpen(false)} className="text-red-500 hover:scale-110 transition-transform"><X className="h-5 w-5" /></button>
              </div>

              {(() => {
                const subtotal = selectedJob.estimate;
                const cgst = Math.round(subtotal * 0.09);
                const sgst = Math.round(subtotal * 0.09);
                const gstTotal = cgst + sgst;
                const discount = Number(selectedJob.overallDiscount) || 0;
                const netPayable = Math.max(0, subtotal + gstTotal - discount);
                const totalPaid = selectedJob.paid || 0;
                const due = Math.max(0, netPayable - totalPaid);
                return (
                  <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] text-xs text-slate-900 dark:text-slate-100">

                    {/* Workshop Header */}
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                      <div>
                        <h4 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">BIKE MASTERS</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Plot No. 120, Near Fire Station, Bhubaneswar, Odisha - 751001<br />Phone: +91 91212 23601 | GSTIN: 21AAAAA0000A1Z0</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-sm block tracking-widest uppercase">TAX INVOICE</span>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">JC: <strong>{selectedJob.id}</strong></p>
                        <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>

                    {/* Customer & Vehicle */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Customer Details</span>
                        <p className="font-extrabold">{selectedJob.customerName}</p>
                        <p className="text-slate-500">{selectedJob.phone}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Vehicle Details</span>
                        <p className="font-extrabold font-mono">{selectedJob.vehicleNo}</p>
                        <p className="text-slate-500">{selectedJob.brandModel} | {selectedJob.kms.toLocaleString()} KM</p>
                      </div>
                    </div>

                    {/* Spares Table */}
                    {selectedJob.spares.length > 0 && (
                      <div>
                        <h5 className="font-extrabold text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">Spare Parts</h5>
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="py-1.5 px-2">S.No</th><th className="py-1.5 px-2">Description</th><th className="py-1.5 px-2">HSN</th><th className="py-1.5 px-2 text-center">Qty</th><th className="py-1.5 px-2 text-right">Rate</th><th className="py-1.5 px-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedJob.spares.map((s, i) => (
                              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="py-1.5 px-2">{i + 1}</td>
                                <td className="py-1.5 px-2 font-semibold">{s.name}</td>
                                <td className="py-1.5 px-2 font-mono text-[10px] text-slate-500">{s.hsn}</td>
                                <td className="py-1.5 px-2 text-center">{s.qty}</td>
                                <td className="py-1.5 px-2 text-right">₹{s.price}</td>
                                <td className="py-1.5 px-2 text-right font-bold">₹{s.qty * s.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Services Table */}
                    {selectedJob.services.length > 0 && (
                      <div>
                        <h5 className="font-extrabold text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">Services / Labour</h5>
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="py-1.5 px-2">S.No</th><th className="py-1.5 px-2">Description</th><th className="py-1.5 px-2">SAC</th><th className="py-1.5 px-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedJob.services.map((s, i) => (
                              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="py-1.5 px-2">{i + 1}</td>
                                <td className="py-1.5 px-2 font-semibold">{s.name}</td>
                                <td className="py-1.5 px-2 font-mono text-[10px] text-slate-500">{s.hsn}</td>
                                <td className="py-1.5 px-2 text-right font-bold">₹{s.rate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Totals + Payment side by side */}
                    <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-slate-700">
                      {/* Tax Breakdown */}
                      <div className="space-y-1.5 text-[11px] max-w-xs ml-auto w-full">
                        <div className="flex justify-between text-slate-500"><span>Subtotal:</span><span className="font-bold text-slate-800 dark:text-slate-200">₹{subtotal}</span></div>
                        <div className="flex justify-between text-slate-500"><span>CGST (9.0%):</span><span className="font-bold text-slate-800 dark:text-slate-200">₹{cgst}</span></div>
                        <div className="flex justify-between text-slate-500"><span>SGST (9.0%):</span><span className="font-bold text-slate-800 dark:text-slate-200">₹{sgst}</span></div>
                        {discount > 0 && <div className="flex justify-between text-red-500"><span>Discount:</span><span className="font-bold">− ₹{discount}</span></div>}
                        <div className="flex justify-between border-t border-slate-300 dark:border-slate-600 pt-1.5 font-black text-sm">
                          <span>Net Payable:</span><span className="text-teal-600 dark:text-teal-400">₹{netPayable}</span>
                        </div>
                      </div>

                      {/* Payment Received */}
                      <div className="space-y-1.5 text-[11px]">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Payment Received</span>
                        {[
                          { label: 'By Card', value: (selectedJob as any).paymentBreakdown?.card },
                          { label: 'By Cash', value: (selectedJob as any).paymentBreakdown?.cash },
                          { label: 'By Cheque', value: (selectedJob as any).paymentBreakdown?.cheque },
                          { label: 'By Other', value: (selectedJob as any).paymentBreakdown?.other },
                        ].filter(p => Number(p.value) > 0).map((p, i) => (
                          <div key={i} className="flex justify-between text-slate-500"><span>{p.label}:</span><span className="font-bold text-teal-600">₹{p.value}</span></div>
                        ))}
                        {totalPaid === 0 && <p className="text-slate-400 italic text-[10px]">No payment recorded yet</p>}
                        <div className="flex justify-between border-t border-slate-300 dark:border-slate-600 pt-1.5 font-black">
                          <span>Total Paid:</span><span className="text-teal-600">₹{totalPaid}</span>
                        </div>
                        {/* Balance Due — display only, not clickable */}
                        <div className="flex justify-between pt-1 font-black select-none pointer-events-none">
                          <span>Balance Due:</span>
                          <span className={due > 0 ? 'text-red-500' : 'text-green-600'}>₹{due}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
                <button onClick={() => window.print()} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs transition-all flex items-center space-x-1.5">
                  <Printer className="h-3.5 w-3.5" /><span>Print</span>
                </button>
                <button onClick={() => setIsInvoiceModalOpen(false)} className="px-6 py-2 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-black text-xs hover:bg-red-200 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DISCOUNT MODAL */}
        {/* ============================================================ */}
        {isDiscountModalOpen && selectedJob && (() => {
          // Live calculations
          const lineItemDiscountTotal = discountForm.lineItems.reduce((sum, item) => {
            const d = item.type === "percentage" ? (item.total * item.value / 100) : item.value;
            return sum + Math.min(Math.max(d, 0), item.total);
          }, 0);
          const overallDiscountAmt = discountForm.overallType === "percentage"
            ? (selectedJob.estimate * discountForm.overallValue / 100)
            : discountForm.overallValue;
          const totalDiscount = Math.min(lineItemDiscountTotal + overallDiscountAmt, selectedJob.estimate);
          const netPayable = Math.max(selectedJob.estimate - totalDiscount, 0);
          const alreadyPaid = selectedJob.paid || 0;
          const balanceDue = Math.max(netPayable - alreadyPaid, 0);
          const gstAmt = Math.round(selectedJob.estimate * 0.18 / 1.18 * 100) / 100;
          const subtotalBeforeTax = Math.round((selectedJob.estimate - gstAmt) * 100) / 100;

          const updateLineItem = (key: string, field: "type" | "value", val: string | number) => {
            setDiscountForm(prev => ({
              ...prev,
              lineItems: prev.lineItems.map(item =>
                item.key === key ? { ...item, [field]: val } : item
              ),
            }));
          };

          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-wide">Discount Manager</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedJob.id} · {selectedJob.vehicleNo} · {selectedJob.customerName}</p>
                  </div>
                  <button onClick={() => setIsDiscountModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-1 overflow-hidden min-h-0">
                  {/* LEFT — inputs */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Available Offers */}
                    {availableOffers.length > 0 && (
                      <div className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base">🏷️</span>
                          <div>
                            <h4 className="text-xs font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest">Available Offers</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Select one offer — it fills the discount automatically</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {availableOffers.map(offer => {
                            const isSelected = selectedOfferId === offer.id;
                            const offerAmt = offer.offerType === "percentage"
                              ? (selectedJob.estimate * offer.discountValue / 100)
                              : offer.discountValue;
                            return (
                              <label
                                key={offer.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="offer"
                                  className="mt-0.5 accent-amber-500"
                                  checked={isSelected}
                                  onChange={() => {
                                    setSelectedOfferId(offer.id);
                                    if (offer.offerType === "percentage") {
                                      setDiscountForm(p => ({ ...p, overallType: "percentage", overallValue: offer.discountValue }));
                                    } else {
                                      setDiscountForm(p => ({ ...p, overallType: "amount", overallValue: offer.discountValue }));
                                    }
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-black text-slate-800 dark:text-white">{offer.title}</span>
                                    <span className="text-xs font-black text-red-500 shrink-0">
                                      − ₹{offerAmt.toFixed(0)}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{offer.description}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {offer.offerType === "percentage" ? `${offer.discountValue}% off` : `₹${offer.discountValue} flat off`}
                                    {" · "}Valid till {new Date(offer.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                          {selectedOfferId && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOfferId(null);
                                setDiscountForm(p => ({ ...p, overallType: "amount", overallValue: 0 }));
                              }}
                              className="text-[10px] text-slate-400 hover:text-red-500 transition-colors mt-1"
                            >
                              ✕ Clear offer
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Overall Discount Card */}
                    <div className="rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/20 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Overall Discount</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Applied on the total bill amount after all line items</p>
                        </div>
                        {overallDiscountAmt > 0 && (
                          <span className="text-sm font-black text-red-500">− ₹{overallDiscountAmt.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Type toggle */}
                        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                          <button
                            type="button"
                            onClick={() => setDiscountForm(p => ({ ...p, overallType: "percentage" }))}
                            className={`px-3 py-2 text-xs font-black transition-colors ${discountForm.overallType === "percentage" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                          >% Pct</button>
                          <button
                            type="button"
                            onClick={() => setDiscountForm(p => ({ ...p, overallType: "amount" }))}
                            className={`px-3 py-2 text-xs font-black transition-colors ${discountForm.overallType === "amount" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                          >₹ Amt</button>
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                            {discountForm.overallType === "percentage" ? "%" : "₹"}
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={discountForm.overallType === "percentage" ? 100 : selectedJob.estimate}
                            value={discountForm.overallValue || ""}
                            placeholder={discountForm.overallType === "percentage" ? "e.g. 10" : "e.g. 500"}
                            onChange={e => setDiscountForm(p => ({ ...p, overallValue: Math.max(0, Number(e.target.value)) }))}
                            className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                        {discountForm.overallType === "percentage" && discountForm.overallValue > 0 && (
                          <div className="shrink-0 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            = ₹{overallDiscountAmt.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Line Item Discounts */}
                    {discountForm.lineItems.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Line Item Discounts</h4>
                          <span className="text-[10px] text-slate-400">Applied per item before taxes</span>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-wider">
                                <th className="py-2.5 px-3">Item</th>
                                <th className="py-2.5 px-3 text-right">Amount</th>
                                <th className="py-2.5 px-3 text-center w-28">Type</th>
                                <th className="py-2.5 px-3 text-center w-24">Value</th>
                                <th className="py-2.5 px-3 text-right w-24">Discount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {/* Spares section */}
                              {discountForm.lineItems.some(i => i.isSpare) && (
                                <tr className="bg-amber-50 dark:bg-amber-950/20">
                                  <td colSpan={5} className="py-1.5 px-3 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Parts & Consumables</td>
                                </tr>
                              )}
                              {discountForm.lineItems.filter(i => i.isSpare).map(item => {
                                const discAmt = item.type === "percentage" ? (item.total * item.value / 100) : item.value;
                                const clampedDisc = Math.min(Math.max(discAmt, 0), item.total);
                                return (
                                  <tr key={item.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-200 max-w-[180px] truncate">{item.name}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-600 dark:text-slate-300">₹{item.total}</td>
                                    <td className="py-2.5 px-3">
                                      <div className="flex rounded border border-slate-200 dark:border-slate-700 overflow-hidden text-[10px]">
                                        <button type="button" onClick={() => updateLineItem(item.key, "type", "percentage")} className={`flex-1 py-1 font-black transition-colors ${item.type === "percentage" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`}>%</button>
                                        <button type="button" onClick={() => updateLineItem(item.key, "type", "amount")} className={`flex-1 py-1 font-black transition-colors ${item.type === "amount" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`}>₹</button>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <input
                                        type="number" min={0}
                                        max={item.type === "percentage" ? 100 : item.total}
                                        value={item.value || ""}
                                        placeholder="0"
                                        onChange={e => updateLineItem(item.key, "value", Math.max(0, Number(e.target.value)))}
                                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-400"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-black">
                                      {clampedDisc > 0
                                        ? <span className="text-red-500">− ₹{clampedDisc.toFixed(2)}</span>
                                        : <span className="text-slate-300 dark:text-slate-600">—</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                              {/* Services section */}
                              {discountForm.lineItems.some(i => !i.isSpare) && (
                                <tr className="bg-blue-50 dark:bg-blue-950/20">
                                  <td colSpan={5} className="py-1.5 px-3 text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Services & Labour</td>
                                </tr>
                              )}
                              {discountForm.lineItems.filter(i => !i.isSpare).map(item => {
                                const discAmt = item.type === "percentage" ? (item.total * item.value / 100) : item.value;
                                const clampedDisc = Math.min(Math.max(discAmt, 0), item.total);
                                return (
                                  <tr key={item.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-200 max-w-[180px] truncate">{item.name}</td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-600 dark:text-slate-300">₹{item.total}</td>
                                    <td className="py-2.5 px-3">
                                      <div className="flex rounded border border-slate-200 dark:border-slate-700 overflow-hidden text-[10px]">
                                        <button type="button" onClick={() => updateLineItem(item.key, "type", "percentage")} className={`flex-1 py-1 font-black transition-colors ${item.type === "percentage" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`}>%</button>
                                        <button type="button" onClick={() => updateLineItem(item.key, "type", "amount")} className={`flex-1 py-1 font-black transition-colors ${item.type === "amount" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`}>₹</button>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <input
                                        type="number" min={0}
                                        max={item.type === "percentage" ? 100 : item.total}
                                        value={item.value || ""}
                                        placeholder="0"
                                        onChange={e => updateLineItem(item.key, "value", Math.max(0, Number(e.target.value)))}
                                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-400"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-black">
                                      {clampedDisc > 0
                                        ? <span className="text-red-500">− ₹{clampedDisc.toFixed(2)}</span>
                                        : <span className="text-slate-300 dark:text-slate-600">—</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT — live bill summary */}
                  <div className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Bill Preview</h4>
                    </div>
                    <div className="p-4 space-y-2.5 flex-1 overflow-y-auto text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal (excl. GST)</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">₹{subtotalBeforeTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>GST (18%)</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">₹{gstAmt.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-700 pt-2">
                        <span>Gross Total</span>
                        <span>₹{selectedJob.estimate.toFixed(2)}</span>
                      </div>

                      {/* Discount breakdown */}
                      {(lineItemDiscountTotal > 0 || overallDiscountAmt > 0) && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 p-3 space-y-1.5 mt-2">
                          <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">Discounts Applied</p>
                          {lineItemDiscountTotal > 0 && (
                            <div className="flex justify-between text-red-500">
                              <span>Line Item Discounts</span>
                              <span className="font-black">− ₹{lineItemDiscountTotal.toFixed(2)}</span>
                            </div>
                          )}
                          {overallDiscountAmt > 0 && (
                            <div className="flex justify-between text-red-500">
                              <span>Overall Discount{discountForm.overallType === "percentage" ? ` (${discountForm.overallValue}%)` : ""}</span>
                              <span className="font-black">− ₹{overallDiscountAmt.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-red-600 font-black border-t border-red-200 dark:border-red-800 pt-1.5">
                            <span>Total Discount</span>
                            <span>− ₹{totalDiscount.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      {/* Net payable highlight */}
                      <div className={`rounded-xl p-3 mt-2 ${totalDiscount > 0 ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-black ${totalDiscount > 0 ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>Net Payable</span>
                          <span className={`text-lg font-black ${totalDiscount > 0 ? "text-white" : "text-slate-800 dark:text-white"}`}>₹{netPayable.toFixed(2)}</span>
                        </div>
                        {totalDiscount > 0 && (
                          <p className="text-[10px] text-teal-100 mt-0.5">You saved ₹{totalDiscount.toFixed(2)} on this bill</p>
                        )}
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1.5">
                        <div className="flex justify-between text-slate-500">
                          <span>Already Paid</span>
                          <span className="font-bold text-teal-600">₹{alreadyPaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black">
                          <span>Balance Due</span>
                          <span className={balanceDue > 0 ? "text-red-500" : "text-green-600"}>₹{balanceDue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons inside right panel */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
                      <button
                        onClick={handleSaveDiscount}
                        disabled={totalDiscount <= 0}
                        className="w-full py-2.5 text-xs font-black text-white bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl transition-colors"
                      >
                        {totalDiscount > 0 ? `Apply ₹${totalDiscount.toFixed(2)} Discount` : "Apply Discount"}
                      </button>
                      <button
                        onClick={() => setIsDiscountModalOpen(false)}
                        className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* VEHICLE HISTORY MODAL */}
        {/* ============================================================ */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                <div className="flex-1 text-center">
                  <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">
                    VEHICLE HISTORY FOR: <span className="text-red-500">{historyVehicleNo}</span>
                  </h3>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="text-red-500 hover:scale-110 transition-transform ml-4">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                    Loading history...
                  </div>
                ) : historyRows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                    <RefreshCw className="h-10 w-10 mb-3 opacity-30" />
                    <p className="font-black text-sm uppercase tracking-wider">No service records found</p>
                    <p className="text-xs mt-1">This vehicle has no previous service history</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-teal-600 text-white font-black uppercase tracking-wide text-[11px]">
                        <th className="py-3 px-4">Invoice No</th>
                        <th className="py-3 px-4">Arrival Date</th>
                        <th className="py-3 px-4">KMS Driven</th>
                        <th className="py-3 px-4">Tax On Services</th>
                        <th className="py-3 px-4">Tax On Parts</th>
                        <th className="py-3 px-4">Spares</th>
                        <th className="py-3 px-4">Labours</th>
                        <th className="py-3 px-4">Discount</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Total Paid</th>
                        <th className="py-3 px-4 text-red-200">Due Amount</th>
                        <th className="py-3 px-4">Tech Name</th>
                        <th className="py-3 px-4">Tech Feedback</th>
                        <th className="py-3 px-4">Customer Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {historyRows.map((row, idx) => {
                        const due = Number(row.dueAmount);
                        return (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-semibold text-slate-700 dark:text-slate-300">
                            <td className="py-3.5 px-4 font-black text-slate-800 dark:text-white whitespace-nowrap">
                              <span className="text-slate-400 mr-0.5">⊕</span>{row.invoiceNo}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">{row.arrivalDate}</td>
                            <td className="py-3.5 px-4 font-mono">{row.kmsDriven || '—'}</td>
                            <td className="py-3.5 px-4 font-mono">{Number(row.taxOnServices).toFixed(2)}</td>
                            <td className="py-3.5 px-4 font-mono">{Number(row.taxOnParts).toFixed(2)}</td>
                            <td className="py-3.5 px-4 font-mono">{Number(row.spares).toFixed(0)}</td>
                            <td className="py-3.5 px-4 font-mono">{Number(row.labours).toFixed(0)}</td>
                            <td className="py-3.5 px-4 font-mono">{Number(row.discount).toFixed(2)}</td>
                            <td className="py-3.5 px-4 font-mono font-black">{Number(row.totalAmount).toFixed(2)}</td>
                            <td className="py-3.5 px-4 font-mono">{Number(row.totalPaid).toFixed(2)}</td>
                            <td className={`py-3.5 px-4 font-black font-mono ${due > 0 ? 'text-red-500' : 'text-green-600'}`}>
                              {due.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 font-bold uppercase text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.techName}</td>
                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 italic">{row.techFeedback || '—'}</td>
                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{row.customerFeedback || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0 flex justify-center">
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-32 py-2.5 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full font-black text-xs hover:bg-red-200 dark:hover:bg-red-950/60 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TOAST SYSTEM (Bottom Right Floating) */}
        {/* ============================================================ */}
        <div className="fixed bottom-6 right-6 z-50 space-y-3.5 max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-2xl shadow-xl flex items-start space-x-3.5 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto border-2 ${
                toast.type === "success" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-green-500 shadow-green-500/5" :
                toast.type === "warn" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-red-500 shadow-red-500/5" :
                "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 shadow-slate-200/20"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-500" />
              ) : toast.type === "warn" ? (
                <ShieldAlert className="h-5 w-5 mt-0.5 shrink-0 text-red-500" />
              ) : (
                <Info className="h-5 w-5 mt-0.5 shrink-0 text-blue-500" />
              )}
              <div className="text-xs font-bold flex-1 leading-relaxed">
                {toast.msg}
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <footer className="shrink-0 h-8 px-5 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Powered by <span className="font-bold text-slate-500 dark:text-slate-400">LeOmm Labs</span>
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            &copy; BikeMaster 2026. All rights reserved.
          </span>
        </footer>

      </div>
    </div>
  );
}
