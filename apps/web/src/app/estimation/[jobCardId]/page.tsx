"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Package,
  Search,
  Plus,
  ArrowLeft,
  X,
  CheckCircle,
  Clock,
  Printer,
  Check,
  Trash2,
  ShieldAlert,
  AlertCircle,
  Tag,
  Settings,
  Info,
  AlertTriangle,
  Download,
  Share2,
  Building,
  User,
  CheckSquare,
  Calendar
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface GeneratedInvoice {
  invoiceNo: string;
  jobCardNo: string;
  customerName: string;
  vehicleNo: string;
  brandModel: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  customerAmount: number;
  insuranceAmount: number;
}

interface PackageItem {
  type: 'spare' | 'service';
  id: string;
  name: string;
  code: string;
  qty: number;
  price: number;
  mrp: number;
  hsn: string;
}

interface PackageMaster {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  spares: PackageItem[];
  services: PackageItem[];
}

interface OfferMaster {
  id: string;
  title: string;
  description: string;
  offerType: string;
  discountValue: number;
  endDate: string;
}

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
  billedTo: "customer" | "insurance";
}

interface ServiceItem {
  name: string;
  rate: number;
  hsn: string;
  code: string;
  status: string;
  billedTo: "customer" | "insurance";
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
}

interface SparePartMaster {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  mrp: number;
  stockQty: number;
  hsnCode: string;
}

interface ServiceMaster {
  id: string;
  name: string;
  code: string;
  rate: number;
  sacCode: string;
}

export default function EstimationPage({ params }: { params: { jobCardId: string } }) {
  const router = useRouter();
  const jobCardId = params.jobCardId;

  // Theme Support
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  // Active Job State
  const [job, setJob] = useState<JobCard | null>(null);
  
  // Search query & catalog buffers
  const [catalogSearchText, setCatalogSearchText] = useState("");
  const [sparesCatalog, setSparesCatalog] = useState<SparePartMaster[]>([]);
  const [servicesCatalog, setServicesCatalog] = useState<ServiceMaster[]>([]);

  // Active added lists inside draft
  const [allocatedSpares, setAllocatedSpares] = useState<SpareItem[]>([]);
  const [allocatedServices, setAllocatedServices] = useState<ServiceItem[]>([]);

  // Page active tabs for allocation list
  const [activeListTab, setActiveListTab] = useState<string>("complaints");

  // Insurance Prompt & Details States
  const [showInsurancePrompt, setShowInsurancePrompt] = useState(true);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [insuranceForm, setInsuranceForm] = useState({ provider: "National Insurance Co.", policyNo: "", expiry: "" });
  const [insuranceDetailsSaved, setInsuranceDetailsSaved] = useState(false);

  // Offers and Packages states
  const [appliedOffers, setAppliedOffers] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [packagesMaster, setPackagesMaster] = useState<PackageMaster[]>([]);
  const [offersMaster, setOffersMaster] = useState<OfferMaster[]>([]);
  const [employeesList, setEmployeesList] = useState<{ id: string; name: string; role: string }[]>([]);

  // Complaints states
  const [allocatedComplaints, setAllocatedComplaints] = useState<Complaint[]>([]);
  const [newComplaintText, setNewComplaintText] = useState("");
  const [newComplaintFinding, setNewComplaintFinding] = useState("");
  const [newComplaintAction, setNewComplaintAction] = useState("repair_now");

  // Rejected items tracking
  const [rejectedItems, setRejectedItems] = useState<any[]>([]);

  // Manage Ops Side Panel state
  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);
  const [managePanelTab, setManagePanelTab] = useState<"inspection" | "allocations" | "masters">("inspection");

  // Digital Vehicle Inspection (101-point) Checklist
  const [inspectionItems, setInspectionItems] = useState([
    { category: "Engine", name: "Engine Compression Ratio check", status: "ok" },
    { category: "Engine", name: "Timing Chain noise and Tensioner guide", status: "attention" },
    { category: "Engine", name: "Spark Plug wear & carbon check", status: "ok" },
    { category: "Engine", name: "Engine Oil Level & viscosity", status: "attention" },
    { category: "Brakes", name: "Front Brake Shoe / Pads thickness", status: "ok" },
    { category: "Brakes", name: "Rear Brake Lever free play", status: "attention" },
    { category: "Suspension", name: "Front Fork oil seal leakage check", status: "critical" },
    { category: "Suspension", name: "Rear Damper shock absorption index", status: "ok" },
    { category: "Electricals", name: "Headlight high/low beam voltage", status: "ok" },
    { category: "Electricals", name: "Tail Light / Brake lamp operation", status: "ok" },
    { category: "Electricals", name: "Indicators & Hazard switch play", status: "ok" },
    { category: "Electricals", name: "Battery cold cranking voltage check", status: "attention" }
  ]);

  // Master lists managers inline forms
  const [newPartMasterForm, setNewPartMasterForm] = useState({ name: "", partNo: "", price: "", mrp: "", stock: "50", hsn: "HSN-8708" });
  const [newServiceMasterForm, setNewServiceMasterForm] = useState({ name: "", code: "", rate: "", sac: "SAC-9987" });
  const [newPackageMasterForm, setNewPackageMasterForm] = useState({ name: "", mrp: "", partsList: "", laborList: "" });

  // Bill print layout types
  const [isEstTypeModalOpen, setIsEstTypeModalOpen] = useState(false);
  const [estimationType, setEstimationType] = useState<"all_inclusive" | "tax_estimation">("all_inclusive");

  // State for Toasts
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: "success" | "info" | "warn" }>>([]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<GeneratedInvoice | null>(null);

  const triggerToast = (msg: string, type: "success" | "info" | "warn" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const getAuthHeaders = (): Record<string, string> => {
    try {
      const session = localStorage.getItem("bikemaster_session");
      if (session) {
        const { token } = JSON.parse(session);
        if (token && token !== "offline-token") return { Authorization: `Bearer ${token}` };
      }
    } catch { /* ignore */ }
    return {};
  };

  const loadFallbackJob = () => {
    const fallbackComplaints = [
      { text: "Engine making heavy noise on acceleration", finding: "Loose timing chain and worn out tensioner guide", action: "repair_now" },
      { text: "Front brake response very poor", finding: "Brake shoes carbonized and worn", action: "replace_now" },
      { text: "Slight rust on crash guard structure", finding: "Surface oxidation observed", action: "observe" },
      { text: "Spark plug gap adjustment", finding: "Normal soot deposits, adjusted gap", action: "declined" }
    ];
    setJob({
      id: jobCardId, vehicleNo: "OD-05-AB-1234", brandModel: "Honda Activa 6G",
      customerName: "Aditya Pradhan", phone: "+91 98765 43210", kms: 12450,
      completion: 75, status: "Under Servicing", advisor: "Subhashis Sen",
      technician: "Manoj Kumar", urgency: "High", estimate: 1450, paid: 0, due: 1450,
      serviceType: "Regular", date: "29 May 2026", complaints: fallbackComplaints, spares: [], services: [], timeline: []
    });
    setAllocatedComplaints(fallbackComplaints);
    setRejectedItems([{ type: "complaint", name: "Spark plug gap adjustment", reason: "Declined: Customer wants to do it next service" }]);
  };

  // Load core details on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const authHeaders = getAuthHeaders();
        const [jobRes, , pkgRes, offerRes, empRes] = await Promise.all([
          fetch(`${API_BASE_URL}/job-cards/${jobCardId}`, { headers: authHeaders }),
          fetchCatalog(""),
          fetch(`${API_BASE_URL}/packages`, { headers: authHeaders }),
          fetch(`${API_BASE_URL}/offers`, { headers: authHeaders }),
          fetch(`${API_BASE_URL}/employees`, { headers: authHeaders }),
        ]);

        if (pkgRes.ok) setPackagesMaster(await pkgRes.json());
        if (offerRes.ok) setOffersMaster(await offerRes.json());
        if (empRes.ok) setEmployeesList(await empRes.json());

        if (jobRes.ok) {
          const jobData = await jobRes.json();
          setJob(jobData);
          setAllocatedSpares(jobData.spares.map((s: SpareItem) => ({ ...s, billedTo: s.billedTo || "customer" })));
          setAllocatedServices(jobData.services.map((s: ServiceItem) => ({ ...s, billedTo: s.billedTo || "customer" })));

          // Load complaints from dedicated endpoint
          const cmpRes = await fetch(`${API_BASE_URL}/job-cards/${jobCardId}/complaints`, { headers: authHeaders });
          const complaints: Complaint[] = cmpRes.ok ? await cmpRes.json() : (jobData.complaints || []);
          setAllocatedComplaints(complaints);
          setRejectedItems(complaints.filter((c: Complaint) => c.action === "declined").map((c: Complaint) => ({ type: "complaint", name: c.text, reason: c.finding || "Declined by customer" })));
        } else {
          triggerToast("Using offline data — job card not found in DB", "warn");
          loadFallbackJob();
        }
      } catch (err) {
        console.error("Backend offline. Simulating estimation data.", err);
        loadFallbackJob();
      }
    };
    loadData();
  }, [jobCardId]);

  // Fetch catalogs dynamically
  const fetchCatalog = async (q: string) => {
    try {
      const authHeaders = getAuthHeaders();
      const [sparesRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/spare-parts/search?q=${encodeURIComponent(q)}`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/services/search?q=${encodeURIComponent(q)}`, { headers: authHeaders }),
      ]);
      if (sparesRes.ok) setSparesCatalog(await sparesRes.json());
      if (servicesRes.ok) setServicesCatalog(await servicesRes.json());
    } catch (err) {
      console.error("Catalog fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCatalog(catalogSearchText);
  }, [catalogSearchText]);

  // Add Spare Part from Catalog to Draft
  const addSpareToEstimate = (part: SparePartMaster) => {
    // Check if already allocated
    const existingIdx = allocatedSpares.findIndex(s => s.code === part.partNumber);
    if (existingIdx !== -1) {
      const copy = [...allocatedSpares];
      copy[existingIdx].qty += 1;
      setAllocatedSpares(copy);
      triggerToast(`Increased quantity of ${part.name}`, "info");
    } else {
      const newItem: SpareItem = {
        name: part.name,
        qty: 1,
        price: part.price,
        mrp: part.mrp,
        hsn: part.hsnCode,
        code: part.partNumber,
        status: "estimated",
        billedTo: "customer"
      };
      setAllocatedSpares([...allocatedSpares, newItem]);
      triggerToast(`Added ${part.name} to estimate`, "success");
    }
  };

  // Add Service from Catalog to Draft
  const addServiceToEstimate = (service: ServiceMaster) => {
    // Check if already allocated
    const exists = allocatedServices.find(s => s.code === service.code);
    if (exists) {
      triggerToast(`${service.name} is already allocated`, "warn");
      return;
    }

    const newItem: ServiceItem = {
      name: service.name,
      rate: service.rate,
      hsn: service.sacCode,
      code: service.code,
      status: "estimated",
      billedTo: "customer"
    };
    setAllocatedServices([...allocatedServices, newItem]);
    triggerToast(`Added ${service.name} labor to estimate`, "success");
  };

  // Adjust Spare Qty
  const handleSpareQtyChange = (idx: number, amount: number) => {
    const copy = [...allocatedSpares];
    const newQty = copy[idx].qty + amount;
    if (newQty <= 0) {
      copy.splice(idx, 1);
      triggerToast("Removed spare part from allocation", "warn");
    } else {
      copy[idx].qty = newQty;
    }
    setAllocatedSpares(copy);
  };

  // Remove Service
  const handleRemoveService = (idx: number) => {
    const copy = [...allocatedServices];
    copy.splice(idx, 1);
    setAllocatedServices(copy);
    triggerToast("Removed service charge from allocation", "warn");
  };

  // Toggle Billed To (Customer/Insurance)
  const toggleBilledTo = (type: "spares" | "services", idx: number) => {
    if (type === "spares") {
      const copy = [...allocatedSpares];
      copy[idx].billedTo = copy[idx].billedTo === "customer" ? "insurance" : "customer";
      setAllocatedSpares(copy);
    } else {
      const copy = [...allocatedServices];
      copy[idx].billedTo = copy[idx].billedTo === "customer" ? "insurance" : "customer";
      setAllocatedServices(copy);
    }
    triggerToast("Toggled billing split preference", "info");
  };

  // Apply service package from DB
  const applyPackage = () => {
    if (!selectedPackage) return;
    const pkg = packagesMaster.find(p => p.id === selectedPackage);
    if (!pkg) return;

    const newSpares = pkg.spares.map(s => ({ name: s.name, qty: s.qty, price: s.price, mrp: s.mrp, hsn: s.hsn, code: s.code, status: "estimated", billedTo: "customer" as const }));
    const newServices = pkg.services.map(s => ({ name: s.name, rate: s.price, hsn: s.hsn, code: s.code, status: "estimated", billedTo: "customer" as const }));

    setAllocatedSpares([...allocatedSpares, ...newSpares]);
    setAllocatedServices([...allocatedServices, ...newServices]);
    triggerToast(`${pkg.name} package applied successfully!`, "success");
    setSelectedPackage("");
  };

  // Apply offer from DB
  const applyOffer = (offerId: string) => {
    if (appliedOffers.includes(offerId)) {
      triggerToast("Offer already applied", "warn");
      return;
    }
    const offer = offersMaster.find(o => o.id === offerId);
    if (!offer) return;
    setAppliedOffers([...appliedOffers, offerId]);

    if (offer.offerType === "percentage") {
      const discount = Math.round(serviceSubtotal * (offer.discountValue / 100));
      setDiscountAmount(prev => prev + discount);
      triggerToast(`${offer.discountValue}% Discount applied! (-₹${discount})`, "success");
    } else if (offer.offerType === "fixed") {
      setDiscountAmount(prev => prev + offer.discountValue);
      triggerToast(`₹${offer.discountValue} Discount applied!`, "success");
    } else if (offer.offerType === "free_part") {
      const freePart = { name: `FREE: ${offer.title}`, qty: 1, price: 0, mrp: offer.discountValue, hsn: "N/A", code: `FREE-${offerId.slice(0, 6)}`, status: "issued", billedTo: "customer" as const };
      setAllocatedSpares(prev => [...prev, freePart]);
      triggerToast(`Free item added to estimate!`, "success");
    }
  };

  // Add customer complaint dynamically and save to DB
  const handleAddComplaint = async () => {
    if (!newComplaintText.trim()) return;
    const complaint: Complaint = { text: newComplaintText, finding: newComplaintFinding, action: newComplaintAction };
    const updated = [...allocatedComplaints, complaint];
    setAllocatedComplaints(updated);
    if (newComplaintAction === "declined") {
      setRejectedItems(prev => [...prev, { type: "complaint", name: newComplaintText, reason: newComplaintFinding || "Declined by customer" }]);
    }
    setNewComplaintText("");
    setNewComplaintFinding("");
    if (job) {
      try {
        await fetch(`${API_BASE_URL}/job-cards/${job.id}/complaints`, {
          method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ complaints: updated }),
        });
      } catch { /* silent */ }
    }
    triggerToast("Customer complaint logged successfully!", "success");
  };

  // Remove applied offer
  const removeAppliedOffer = (offerId: string, idx: number) => {
    setAppliedOffers(prev => prev.filter((_, i) => i !== idx));
    const offer = offersMaster.find(o => o.id === offerId);
    if (offer) {
      if (offer.offerType === "percentage") {
        const discount = Math.round(serviceSubtotal * (offer.discountValue / 100));
        setDiscountAmount(prev => Math.max(0, prev - discount));
      } else if (offer.offerType === "fixed") {
        setDiscountAmount(prev => Math.max(0, prev - offer.discountValue));
      } else if (offer.offerType === "free_part") {
        setAllocatedSpares(prev => prev.filter(s => !s.code.startsWith("FREE-")));
      }
    }
    triggerToast("Offer removed successfully", "info");
  };

  // Convert number to Indian Rupees words
  const numberToWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    if (num === 0) return "Zero Rupees";
    const helper = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + helper(n % 100) : "");
      if (n < 100000) return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + helper(n % 1000) : "");
      return String(n);
    };
    return helper(num) + " Rupees Only";
  };

  // Recalculate totals dynamically
  const spareSubtotal = allocatedSpares.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const serviceSubtotal = allocatedServices.reduce((sum, item) => sum + item.rate, 0);
  const rawSubtotal = spareSubtotal + serviceSubtotal;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  
  // Calculate splits
  const rawCustomerBilled = 
    allocatedSpares.filter(s => s.billedTo === "customer").reduce((sum, s) => sum + (s.price * s.qty), 0) +
    allocatedServices.filter(s => s.billedTo === "customer").reduce((sum, s) => sum + s.rate, 0);
  const customerBilled = Math.max(0, rawCustomerBilled - discountAmount);

  const insuranceBilled = Math.max(0, subtotal - customerBilled);

  const gstAmount = Math.round(subtotal * 0.18);
  const netTotal = subtotal + gstAmount;

  // Save the entire Estimate (spares, services, complaints) to the database
  const handleSaveEstimate = async () => {
    if (!job) return;
    try {
      const headers = { "Content-Type": "application/json", ...getAuthHeaders() };
      const [sparesRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/job-cards/${job.id}/spare-items`, {
          method: "POST", headers, body: JSON.stringify({ items: allocatedSpares }),
        }),
        fetch(`${API_BASE_URL}/job-cards/${job.id}/service-items`, {
          method: "POST", headers, body: JSON.stringify({ items: allocatedServices }),
        }),
        fetch(`${API_BASE_URL}/job-cards/${job.id}/complaints`, {
          method: "POST", headers, body: JSON.stringify({ complaints: allocatedComplaints }),
        }),
        fetch(`${API_BASE_URL}/job-cards/${job.id}`, {
          method: "PATCH", headers, body: JSON.stringify({ isEstimated: allocatedSpares.length > 0 || allocatedServices.length > 0, completion: Math.max(job.completion || 10, 20), overallDiscount: discountAmount }),
        }),
      ]);

      if (sparesRes.ok && servicesRes.ok) {
        triggerToast("Draft saved to database!", "success");
        const updatedRes = await fetch(`${API_BASE_URL}/job-cards/${job.id}`, { headers: getAuthHeaders() });
        if (updatedRes.ok) setJob(await updatedRes.json());
      } else {
        triggerToast("Failed to save some changes", "warn");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Save failed - check connection", "warn");
    }
  };

  // Opens a clean isolated window containing only the invoice HTML and prints it.
  // This avoids every CSS-isolation problem (blank pages, repeated fixed elements,
  // browser URL headers) that come with calling window.print() from inside a modal.
  const printInvoice = () => {
    const area = document.getElementById("invoice-print-area");
    if (!area) return;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice</title>
  <style>
    @page { size: A4; margin: 1cm; }
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10pt;
      color: #0f172a;
      background: #fff;
      margin: 0;
      padding: 0;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-1\\.5 > * + * { margin-top: 0.375rem; }
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .flex { display: flex; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-end { justify-content: flex-end; }
    .space-x-3 > * + * { margin-left: 0.75rem; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    .font-black { font-weight: 900; }
    .italic { font-style: italic; }
    .uppercase { text-transform: uppercase; }
    .tracking-wide { letter-spacing: 0.025em; }
    .tracking-wider { letter-spacing: 0.05em; }
    .tracking-widest { letter-spacing: 0.1em; }
    .leading-relaxed { line-height: 1.625; }
    .leading-normal { line-height: 1.5; }
    .w-full { width: 100%; }
    .max-w-\\[320px\\] { max-width: 320px; }
    .ml-auto { margin-left: auto; }
    .w-28 { width: 7rem; }
    .w-36 { width: 9rem; }
    .pt-1 { padding-top: 0.25rem; }
    .pt-2 { padding-top: 0.5rem; }
    .pt-4 { padding-top: 1rem; }
    .pt-8 { padding-top: 2rem; }
    .pb-1 { padding-bottom: 0.25rem; }
    .pb-4 { padding-bottom: 1rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-0\\.5 { margin-top: 0.125rem; }
    .overflow-x-auto { overflow-x: auto; }
    /* Colours */
    .text-slate-900 { color: #0f172a; }
    .text-slate-850 { color: #1a2332; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-750 { color: #263345; }
    .text-slate-700 { color: #334155; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .text-slate-400 { color: #94a3b8; }
    .text-green-600 { color: #16a34a; }
    .text-white { color: #ffffff; }
    .bg-white { background-color: #ffffff; }
    .bg-slate-50 { background-color: #f8fafc; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .bg-slate-100 { background-color: #f1f5f9; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .bg-red-600 { background-color: #dc2626; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    /* Text sizes */
    .text-xs { font-size: 0.75rem; }
    .text-\\[11px\\] { font-size: 11px; }
    .text-\\[10px\\] { font-size: 10px; }
    .text-\\[9px\\] { font-size: 9px; }
    .text-sm { font-size: 0.875rem; }
    .text-base { font-size: 1rem; }
    .text-lg { font-size: 1.125rem; }
    .font-mono { font-family: ui-monospace, monospace; }
    /* Borders */
    .border-b { border-bottom: 1px solid #e2e8f0; }
    .border-t { border-top: 1px solid #e2e8f0; }
    .border { border: 1px solid #e2e8f0; }
    .border-slate-300 { border-color: #cbd5e1; }
    .border-slate-200 { border-color: #e2e8f0; }
    .border-slate-150 { border-color: #eef2f7; }
    .border-slate-100 { border-color: #f1f5f9; }
    .border-collapse { border-collapse: collapse; }
    /* Rounded */
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-lg { border-radius: 0.5rem; }
    /* Table */
    table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 8pt; color: #0f172a; }
    th { background-color: #f1f5f9; font-weight: 800; text-transform: uppercase; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    tr { page-break-inside: avoid; }
    .min-w-\\[600px\\] { min-width: 0; }
    /* Responsive grid overrides */
    .sm\\:grid-cols-2, .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  </style>
</head>
<body>${area.innerHTML}</body>
</html>`);

    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  };

  // Compile Estimate: save everything then create invoice record in DB
  const handlePrintPdf = async () => {
    if (!job) return;
    await handleSaveEstimate();
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/generate-pdf/${job.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ subtotal, discountAmount, taxAmount: gstAmount, totalAmount: netTotal, customerAmount: customerBilled, insuranceAmount: insuranceBilled }),
      });
      if (res.ok) {
        const inv = await res.json();
        setGeneratedInvoice({ ...inv, taxAmount: inv.taxAmount ?? gstAmount, totalAmount: inv.totalAmount ?? netTotal });
        setIsInvoiceModalOpen(true);
        triggerToast("Estimate compiled and saved to database!", "success");
      } else {
        throw new Error("Invoice API failed");
      }
    } catch (err) {
      console.error(err);
      setGeneratedInvoice({ invoiceNo: `INV-BBR-${new Date().getFullYear()}-DRAFT`, jobCardNo: job.id, customerName: job.customerName, vehicleNo: job.vehicleNo, brandModel: job.brandModel, subtotal, discountAmount, taxAmount: gstAmount, totalAmount: netTotal, customerAmount: customerBilled, insuranceAmount: insuranceBilled });
      setIsInvoiceModalOpen(true);
      triggerToast("Estimate compiled (check DB connection)", "warn");
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <Clock className="h-10 w-10 text-green-500 animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Syncing with WMS database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen lg:h-screen lg:overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans`}>
        
        {/* ============================================================ */}
        {/* Header Bar */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-800/95 backdrop-blur border-b border-slate-200 dark:border-slate-700/80 shadow-md">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div className="flex flex-col pl-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-green-600 dark:text-green-400 font-mono tracking-wider">{job.id}</span>
                  <span className="h-1 w-1 bg-slate-400 dark:bg-slate-500 rounded-full" />
                  <span className="font-mono font-bold text-xs uppercase tracking-wide text-slate-850 dark:text-white">{job.vehicleNo}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Advisor: {job.advisor} | Tech: {job.technician}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
              <div className="hidden lg:flex flex-col items-end mr-3 shrink-0">
                <span className="text-xs text-slate-400 dark:text-slate-500">Client Details:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{job.customerName} ({job.phone})</span>
              </div>
              <button
                onClick={handleSaveEstimate}
                className="px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors shrink-0"
              >
                Save Draft
              </button>
              <button
                onClick={() => setIsManagePanelOpen(true)}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl transition-colors shrink-0"
              >
                <Settings className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                <span>MANAGE OPS</span>
              </button>
              <button
                onClick={() => setIsEstTypeModalOpen(true)}
                className="flex items-center space-x-1.5 bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-xs px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
              >
                <Printer className="h-4 w-4 shrink-0" />
                <span>COMPILE ESTIMATE</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Workspace Grid */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          
          {/* Left Side: Live Catalog Search & Add */}
          <div className="w-full lg:w-[440px] h-[300px] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col overflow-hidden">
            
            {/* Catalog Search input */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Catalog & Spares Master</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={catalogSearchText}
                  onChange={(e) => setCatalogSearchText(e.target.value)}
                  placeholder="Search spares name, part no, labor..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/60 border border-slate-200 dark:border-slate-700/60"
                />
              </div>
            </div>

            {/* Catalog listing */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* 1. Spare parts catalogue */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                  <Package className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                  <span>SPARE PARTS IN CATALOG ({sparesCatalog.length})</span>
                </h4>
                {sparesCatalog.map((part) => (
                  <div key={part.id} className="flex justify-between items-center p-2.5 bg-white hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 rounded-xl border border-slate-150 dark:border-slate-800/80 text-xs transition-colors shadow-sm">
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200">{part.name}</h5>
                      <div className="flex space-x-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>{part.partNumber}</span>
                        <span>•</span>
                        <span className={part.stockQty <= 5 ? "text-red-500 dark:text-red-400" : "text-slate-450 dark:text-slate-500"}>Stock: {part.stockQty} PCS</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold pr-1 text-slate-800 dark:text-slate-200">₹{part.price}</span>
                      <button
                        onClick={() => addSpareToEstimate(part)}
                        className="p-1 rounded bg-green-500/10 hover:bg-green-500 text-green-600 dark:text-green-400 hover:text-white dark:hover:text-slate-900 border border-green-500/20 transition-all flex items-center justify-center"
                      >
                        <Plus className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Services Labor catalogue */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                  <Wrench className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                  <span>SERVICES LABOR MASTER ({servicesCatalog.length})</span>
                </h4>
                {servicesCatalog.map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-2.5 bg-white hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 rounded-xl border border-slate-150 dark:border-slate-800/80 text-xs transition-colors shadow-sm">
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200">{service.name}</h5>
                      <div className="flex space-x-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>{service.code}</span>
                        <span>•</span>
                        <span>SAC: {service.sacCode}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold pr-1 text-slate-800 dark:text-slate-200">₹{service.rate}</span>
                      <button
                        onClick={() => addServiceToEstimate(service)}
                        className="p-1 rounded bg-green-500/10 hover:bg-green-500 text-green-600 dark:text-green-400 hover:text-white dark:hover:text-slate-900 border border-green-500/20 transition-all flex items-center justify-center"
                      >
                        <Plus className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Side: Active Draft List Allocation */}
          <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950 lg:overflow-hidden overflow-visible p-4 md:p-6 space-y-4 md:space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="text-lg font-black tracking-wide text-slate-800 dark:text-white">Estimation Workspace</h2>
              
              {/* Tabs for allocation list */}
              <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-[10px] sm:text-xs overflow-x-auto max-w-full sm:max-w-[550px] scrollbar-thin">
                <button
                  onClick={() => setActiveListTab("offers")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                    activeListTab === "offers" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  🎁 Offers ({appliedOffers.length})
                </button>
                <button
                  onClick={() => setActiveListTab("complaints")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                    activeListTab === "complaints" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  📋 Complaints ({allocatedComplaints.length})
                </button>
                <button
                  onClick={() => setActiveListTab("packages")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                    activeListTab === "packages" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  📦 Packages
                </button>
                <button
                  onClick={() => {
                    setActiveListTab("spares");
                    if (showInsurancePrompt && !insuranceDetailsSaved) {
                      setIsInsuranceModalOpen(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                    activeListTab === "spares" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  ⚙️ Spares ({allocatedSpares.length})
                </button>
                <button
                  onClick={() => setActiveListTab("services")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                    activeListTab === "services" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
              >
                🛠️ Services ({allocatedServices.length})
              </button>
              <button
                onClick={() => setActiveListTab("rejected")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                  activeListTab === "rejected" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                ❌ Rejected ({rejectedItems.length})
              </button>
            </div>
          </div>

          {/* Tab content displays */}
          <div className="flex-1 lg:overflow-y-auto overflow-visible border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 rounded-2xl p-4">
            {/* T1. OFFERS TAB */}
            {activeListTab === "offers" && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  Select applicable promotional coupons and campaign codes to apply discounts.
                </div>
                {offersMaster.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 text-center">No active offers available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offersMaster.map(offer => (
                      <div key={offer.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-extrabold text-[9px] uppercase tracking-wide">
                              {offer.offerType === "percentage" ? "% Discount" : offer.offerType === "fixed" ? "Flat Off" : "Free Item"}
                            </span>
                            <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mt-1">{offer.title}</h4>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{offer.description}</p>
                          </div>
                          <Tag className="h-5 w-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800/80">
                          <span className="text-[10px] text-slate-500 font-bold">Expires: {offer.endDate ? new Date(offer.endDate).toLocaleDateString("en-IN") : "N/A"}</span>
                          <button
                            onClick={() => applyOffer(offer.id)}
                            className={`px-3 py-1.5 rounded-xl font-black text-[10px] transition-colors ${
                              appliedOffers.includes(offer.id) ? "bg-green-500 text-slate-900" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                          >
                            {appliedOffers.includes(offer.id) ? "Applied ✓" : "Apply Offer"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {appliedOffers.length > 0 && (
                  <div className="space-y-2.5 pt-4">
                    <h5 className="text-[10px] font-black text-slate-550 dark:text-slate-500 uppercase tracking-widest">Active discounts applied</h5>
                    <div className="space-y-2">
                      {appliedOffers.map((offerId, idx) => {
                        const o = offersMaster.find(x => x.id === offerId);
                        return (
                          <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-green-500/5 border border-green-500/25 text-xs text-green-600 dark:text-green-400">
                            <span className="font-bold">{o?.title || offerId}</span>
                            <button onClick={() => removeAppliedOffer(offerId, idx)} className="text-red-500 dark:text-red-400 hover:text-red-650 dark:hover:text-red-300 font-extrabold text-[10px]">Remove</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* T2. COMPLAINTS TAB */}
            {activeListTab === "complaints" && (
              <div className="space-y-5">
                
                {/* Form to log complaint */}
                <div className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/60 space-y-4 shadow-sm">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Log Customer Complaint</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 mb-1">Customer Complaint Text</label>
                      <input
                        type="text"
                        value={newComplaintText}
                        onChange={(e) => setNewComplaintText(e.target.value)}
                        placeholder="e.g. Engine vibrations at high speed"
                        className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 mb-1">Workshop Finding / Diagnosis</label>
                      <input
                        type="text"
                        value={newComplaintFinding}
                        onChange={(e) => setNewComplaintFinding(e.target.value)}
                        placeholder="e.g. Loose exhaust clamp and worn guide"
                        className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col w-[200px]">
                      <label className="text-[10px] font-bold text-slate-500 mb-1">Recommended Action</label>
                      <select
                        value={newComplaintAction}
                        onChange={(e) => setNewComplaintAction(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs focus:outline-none border border-slate-200 dark:border-slate-700"
                      >
                        <option value="repair_now">Repair Now</option>
                        <option value="replace_now">Replace Now</option>
                        <option value="observe">Observe & Advise</option>
                        <option value="declined">Declined by Customer</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddComplaint}
                      className="px-4 py-2 bg-green-500 text-slate-900 font-extrabold text-xs rounded-xl hover:bg-green-600 transition-colors shadow-sm self-end"
                    >
                      Log to Job Card
                    </button>
                  </div>
                </div>

                {/* Table list of complaints */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Complaints Ledger ({allocatedComplaints.length})</h4>
                  {allocatedComplaints.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 text-center">No customer complaints logged for this visit.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {allocatedComplaints.map((c, i) => (
                        <div key={i} className="p-3.5 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs flex justify-between items-start shadow-sm">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">#{i + 1} {c.text}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                c.action === "repair_now" ? "bg-blue-500/10 text-blue-650 dark:text-blue-400 border border-blue-500/20" :
                                c.action === "replace_now" ? "bg-amber-500/10 text-amber-650 dark:text-amber-400 border border-amber-500/20" :
                                c.action === "observe" ? "bg-teal-500/10 text-teal-650 dark:text-teal-400 border border-teal-500/20" :
                                "bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/20"
                              }`}>
                                {c.action.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-1.5"><span className="text-[9px] text-slate-500 font-bold uppercase">DiagnosisFinding:</span> {c.finding || "Awaiting mechanic diagnosis"}</p>
                          </div>
                          <button
                            onClick={() => {
                              setAllocatedComplaints(prev => prev.filter((_, idx) => idx !== i));
                              triggerToast("Complaint record deleted", "warn");
                            }}
                            className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom triggers */}
                <div className="flex flex-wrap gap-2.5 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                  <button onClick={() => triggerToast("WhatsApp dispatch sent successfully!", "success")} className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-500/20 font-bold text-[10px] transition-all shadow-sm">
                    Send Message (WhatsApp)
                  </button>
                  <button onClick={() => triggerToast("Customer note added", "info")} className="px-3.5 py-2 rounded-xl bg-slate-555 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors border border-slate-200 dark:border-slate-700/60 shadow-sm">
                    + Add Customer Note
                  </button>
                  <button onClick={() => triggerToast("Internal workshop note logged", "info")} className="px-3.5 py-2 rounded-xl bg-slate-555 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors border border-slate-200 dark:border-slate-700/60 shadow-sm">
                    + Add Internal Note
                  </button>
                </div>

              </div>
            )}

            {/* T3. PACKAGES TAB */}
            {activeListTab === "packages" && (
              <div className="space-y-5">
                <div className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/60 space-y-4 shadow-sm">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Apply Service Packages Bundle</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 mb-1">Select Package Name</label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs focus:outline-none border border-slate-200 dark:border-slate-700 font-bold"
                      >
                        <option value="">-- Choose Package Bundle --</option>
                        {packagesMaster.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>{pkg.name} (MRP: ₹{pkg.totalPrice.toLocaleString("en-IN")})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {selectedPackage && (() => {
                    const pkg = packagesMaster.find(p => p.id === selectedPackage);
                    if (!pkg) return null;
                    return (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] space-y-1">
                        <span className="font-bold text-slate-600 dark:text-slate-300 block">{pkg.description}</span>
                        <span className="text-slate-500">Includes: {[...pkg.spares.map(s => s.name), ...pkg.services.map(s => s.name)].join(", ")}</span>
                      </div>
                    );
                  })()}
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-xs">
                      <span className="text-slate-500 font-semibold block">Total Package MRP:</span>
                      <span className="text-sm font-black text-green-600 dark:text-green-400">
                        ₹{selectedPackage ? (packagesMaster.find(p => p.id === selectedPackage)?.totalPrice || 0).toLocaleString("en-IN") : "0"}
                      </span>
                    </div>
                    <button type="button" onClick={applyPackage} className="px-4 py-2 bg-green-500 text-slate-900 font-extrabold text-xs rounded-xl hover:bg-green-600 transition-colors shadow-sm">
                      Apply Package Items
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* T4. SPARES TAB LIST */}
            {activeListTab === "spares" && (
              <div className="space-y-4">
                
                {/* Insurance details header display if saved */}
                {insuranceDetailsSaved && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between text-xs text-purple-650 dark:text-purple-400 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                      <span>Insurer Context: <strong className="text-slate-850 dark:text-white">{insuranceForm.provider}</strong> | Expiry: <strong>{insuranceForm.expiry}</strong></span>
                    </div>
                    <button onClick={() => setIsInsuranceModalOpen(true)} className="text-[10px] text-slate-800 dark:text-white hover:underline">Edit Info</button>
                  </div>
                )}

                {/* Spares stats bar */}
                <div className="grid grid-cols-4 gap-2 bg-white dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                  <div className="flex flex-col border-r border-slate-150 dark:border-slate-800">
                    <span>Parts count</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{allocatedSpares.length}</span>
                  </div>
                  <div className="flex flex-col border-r border-slate-150 dark:border-slate-800">
                    <span>In stock</span>
                    <span className="text-xs font-black text-green-600 dark:text-green-400 mt-0.5">
                      {allocatedSpares.filter(s => !s.name.includes("Flush")).length}
                    </span>
                  </div>
                  <div className="flex flex-col border-r border-slate-150 dark:border-slate-800">
                    <span>Out of stock</span>
                    <span className="text-xs font-black text-red-500 mt-0.5">0</span>
                  </div>
                  <div className="flex flex-col">
                    <span>Status</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">Issued</span>
                  </div>
                </div>

                {allocatedSpares.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16">
                    <Package className="h-10 w-10 text-slate-400 dark:text-slate-700 mb-2" />
                    <p className="text-xs">No spare parts allocated to this estimate draft.</p>
                    <p className="text-[10px] mt-1 text-slate-400 dark:text-slate-600">Select parts from the catalog on the left to add.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {allocatedSpares.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs shadow-sm">
                        <div className="flex items-center space-x-3.5">
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded-lg">
                            <Package className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.name}</h5>
                            <div className="flex space-x-2 mt-0.5 text-[10px] text-slate-550 dark:text-slate-500 font-mono">
                              <span>{item.code}</span>
                              <span>•</span>
                              <span>GST 18%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-5">
                          
                          {/* Billed to toggle button */}
                          <button
                            onClick={() => toggleBilledTo("spares", idx)}
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border transition-colors ${
                              item.billedTo === "customer"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-purple-500/10 border-purple-500/20 text-purple-650 dark:text-purple-400"
                            }`}
                          >
                            {item.billedTo}
                          </button>

                          {/* Adjust Qty */}
                          <div className="flex items-center space-x-2 border border-slate-250 dark:border-slate-700 rounded-lg px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800">
                            <button onClick={() => handleSpareQtyChange(idx, -1)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-black text-sm px-1.5 bg-transparent border-0">-</button>
                            <span className="text-xs font-bold w-4 text-center text-slate-850 dark:text-white">{item.qty}</span>
                            <button onClick={() => handleSpareQtyChange(idx, 1)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-black text-sm px-1.5 bg-transparent border-0">+</button>
                          </div>

                          {/* Price override + computation */}
                          <div className="flex flex-col items-end w-24">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => {
                                const copy = [...allocatedSpares];
                                copy[idx].price = Number(e.target.value) || 0;
                                setAllocatedSpares(copy);
                              }}
                              className="w-20 text-right px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <span className="text-[10px] text-slate-500 mt-0.5">= ₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* T5. SERVICES LABOR TAB LIST */}
            {activeListTab === "services" && (
              allocatedServices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16">
                  <Wrench className="h-10 w-10 text-slate-400 dark:text-slate-700 mb-2" />
                  <p className="text-xs">No service labor charges allocated to this draft.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {allocatedServices.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs shadow-sm">
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
                          <Wrench className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-850 dark:text-slate-200">{item.name}</h5>
                          <div className="flex space-x-2 mt-0.5 text-[10px] text-slate-550 dark:text-slate-500 font-mono">
                            <span>{item.code}</span>
                            <span>•</span>
                            <span>SAC 9987 (18%)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        
                        {/* Billed to toggle button */}
                        <button
                          onClick={() => toggleBilledTo("services", idx)}
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border transition-colors ${
                            item.billedTo === "customer"
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "bg-purple-500/10 border-purple-500/20 text-purple-650 dark:text-purple-400"
                          }`}
                        >
                          {item.billedTo}
                        </button>

                        <span className="font-extrabold w-16 text-right text-slate-850 dark:text-white">₹{item.rate}</span>
                        <button
                          onClick={() => handleRemoveService(idx)}
                          className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent border-0 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* T6. REJECTED TAB */}
            {activeListTab === "rejected" && (
              <div className="space-y-4">
                <div className="p-3 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-200 dark:border-red-500/10 text-[11px] text-red-700 dark:text-red-400">
                  Logs all items declined or deferred by the customer. Essential for tracking lost revenue details.
                </div>
                
                {rejectedItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 text-center">No rejected items tracked in this estimate.</p>
                ) : (
                  <div className="space-y-3">
                    {rejectedItems.map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-4.5 w-4.5 text-red-500 dark:text-red-400 shrink-0" />
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-300 block">{item.name}</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Audit Reason: {item.reason}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-[9px] font-black text-red-700 dark:text-red-400 uppercase">Declined</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Allocation Totals Card */}
          <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-600 dark:text-slate-450">Billed Allocation Split:</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase">
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-xl shrink-0">Customer: ₹{customerBilled}</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-650 dark:text-purple-400 px-2.5 py-1 rounded-xl shrink-0">Insurance: ₹{insuranceBilled}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-bold text-center">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/40">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Subtotal</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹{subtotal}</span>
              </div>
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/40">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">GST Tax (18%)</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹{gstAmount}</span>
              </div>
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/40 ring-1 ring-green-200 dark:ring-green-500/20 bg-green-50/50 dark:bg-green-500/5">
                <span className="text-[10px] text-green-600 dark:text-green-500 uppercase tracking-wider mb-0.5">Net Dues</span>
                <span className="text-sm font-black text-green-600 dark:text-green-400">₹{netTotal}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* INVOICE / PDF COMPILE MODAL */}
      {/* ============================================================ */}
      {isInvoiceModalOpen && generatedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl my-8">
            
            <div className="p-4 bg-slate-900 border-b border-slate-700/80 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-green-400">
                <Printer className="h-5 w-5" />
                <h3 className="text-sm font-black uppercase tracking-wider">Compiled Invoice Preview ({estimationType === "all_inclusive" ? "All Inclusive" : "Tax Invoice"})</h3>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={estimationType}
                  onChange={(e) => setEstimationType(e.target.value as "all_inclusive" | "tax_estimation")}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="all_inclusive">All Inclusive Estimate</option>
                  <option value="tax_estimation">Tax-Estimation format</option>
                </select>
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Compiled Invoice content */}
            <div id="invoice-print-area" className="p-8 space-y-6 text-xs text-slate-900 bg-white border-t border-slate-200 overflow-y-auto max-h-[70vh]">
              
              {/* Workshop Header */}
              <div className="flex justify-between border-b border-slate-300 pb-4">
                <div className="flex items-start space-x-3">
                  <img src="/assets/bike_master_logo.jpg" alt="BikeMasters Logo" style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8 }} />
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 uppercase">BIKE MASTERS</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      Plot No. 120, Near Fire Station, Bhubaneswar, Odisha - 751001 <br />
                      Phone: +91 91212 23601 | Email: support@bikemasters.in | Web: www.bikemasters.com
                    </p>
                    <p className="text-[10px] font-bold text-slate-700 mt-1">GSTIN: 21AAAAA0000A1Z0</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm block tracking-widest">{estimationType === "all_inclusive" ? "ESTIMATION SHEET" : "TAX INVOICE"}</span>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">NO: <strong className="text-slate-900">{generatedInvoice.invoiceNo}</strong></p>
                  <p className="text-[10px] text-slate-600">JOBCARD NO: <strong className="text-slate-900">{job.id}</strong></p>
                  <p className="text-[10px] text-slate-600 mt-0.5">DATE: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </div>
              </div>

              {/* Customer & Vehicle Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Customer Details:</span>
                  <p className="font-extrabold text-slate-800 text-xs">{job.customerName}</p>
                  <p className="text-slate-600">Phone: {job.phone}</p>
                  <p className="text-slate-600">Address: Plot 22B, Saheed Nagar, Bhubaneswar</p>
                  <p className="text-slate-600">Received By: Om Prakash</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Vehicle Details:</span>
                  <p className="font-extrabold text-slate-800 text-xs">REG NO: {job.vehicleNo}</p>
                  <p className="text-slate-600">Brand / Model: {job.brandModel}</p>
                  <p className="text-slate-600">KMs: {job.kms} KM</p>
                  <p className="text-slate-600 font-mono">VIN/Chassis: MH12AB123456789</p>
                </div>
              </div>

              {/* SPARES TABLE */}
              <div className="space-y-2">
                <h5 className="font-extrabold text-[10px] text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-1">Particulars of Parts (SPARES)</h5>
                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                  <table className="w-full text-left border-collapse text-[11px] min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2 px-2.5 w-10">S.No</th>
                      <th className="py-2 px-2.5">Description</th>
                      <th className="py-2 px-2.5 w-24">HSN/SAC</th>
                      <th className="py-2 px-2.5 w-16 text-center">QTY</th>
                      <th className="py-2 px-2.5 w-24 text-right">Unit Price (₹)</th>
                      <th className="py-2 px-2.5 w-28 text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocatedSpares.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-3 px-2.5 italic text-slate-400 text-center">No spare parts allocated to this invoice.</td>
                      </tr>
                    ) : (
                      allocatedSpares.map((item, index) => {
                        const basePrice = item.price;
                        const displayPrice = estimationType === "all_inclusive" ? Math.round(basePrice * 1.18) : basePrice;
                        return (
                          <tr key={index} className="border-b border-slate-150 hover:bg-slate-50/50">
                            <td className="py-2 px-2.5">{index + 1}</td>
                            <td className="py-2 px-2.5 font-bold text-slate-800">{item.name}</td>
                            <td className="py-2 px-2.5 font-mono text-[10px] text-slate-600">{item.hsn}</td>
                            <td className="py-2 px-2.5 text-center">{item.qty}</td>
                            <td className="py-2 px-2.5 text-right">₹{displayPrice}</td>
                            <td className="py-2 px-2.5 text-right font-bold text-slate-850">₹{displayPrice * item.qty}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                </div>
              </div>

              {/* SERVICES TABLE */}
              <div className="space-y-2 pt-2">
                <h5 className="font-extrabold text-[10px] text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-1">Particulars of Services (LABOUR WORKS)</h5>
                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                  <table className="w-full text-left border-collapse text-[11px] min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2 px-2.5 w-10">S.No</th>
                      <th className="py-2 px-2.5">Description</th>
                      <th className="py-2 px-2.5 w-24">HSN/SAC</th>
                      <th className="py-2 px-2.5 w-16 text-center">QTY</th>
                      <th className="py-2 px-2.5 w-24 text-right">Unit Price (₹)</th>
                      <th className="py-2 px-2.5 w-28 text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocatedServices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-3 px-2.5 italic text-slate-400 text-center">No service labor charges allocated.</td>
                      </tr>
                    ) : (
                      allocatedServices.map((item, index) => {
                        const basePrice = item.rate;
                        const displayPrice = estimationType === "all_inclusive" ? Math.round(basePrice * 1.18) : basePrice;
                        return (
                          <tr key={index} className="border-b border-slate-150 hover:bg-slate-50/50">
                            <td className="py-2 px-2.5">{index + 1}</td>
                            <td className="py-2 px-2.5 font-bold text-slate-800">{item.name}</td>
                            <td className="py-2 px-2.5 font-mono text-[10px] text-slate-600">{item.hsn}</td>
                            <td className="py-2 px-2.5 text-center">1</td>
                            <td className="py-2 px-2.5 text-right">₹{displayPrice}</td>
                            <td className="py-2 px-2.5 text-right font-bold text-slate-850">₹{displayPrice}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                </div>
              </div>

              {/* Subtotal Calculation Splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-[11px]">
                <div className="space-y-4">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-150">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Amount in Words:</span>
                    <p className="font-extrabold text-slate-850 italic">{numberToWords(netTotal)}</p>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Note field, Remarks:</span>
                    <p className="text-slate-600 leading-normal">
                      * All prices are computed according to standardized RAMP WMS master catalogue indices. <br />
                      * Standard parts catalog mapping is updated dynamically at each branch check-in.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-w-[320px] ml-auto w-full">
                  <div className="flex justify-between text-slate-600">
                    <span>Labor / Services Subtotal:</span>
                    <span className="font-bold text-slate-800">₹{estimationType === "all_inclusive" ? Math.round(serviceSubtotal * 1.18) : serviceSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Spare Parts Subtotal:</span>
                    <span className="font-bold text-slate-800">₹{estimationType === "all_inclusive" ? Math.round(spareSubtotal * 1.18) : spareSubtotal}</span>
                  </div>
                  {appliedOffers.length > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Applied Discounts:</span>
                      <span>-₹{estimationType === "all_inclusive" ? Math.round(discountAmount * 1.18) : discountAmount}</span>
                    </div>
                  )}
                  {estimationType === "tax_estimation" && (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST (9.0%):</span>
                        <span className="font-bold text-slate-800">₹{Math.round(gstAmount / 2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST (9.0%):</span>
                        <span className="font-bold text-slate-800">₹{Math.round(gstAmount / 2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black text-slate-900">
                    <span>NET GRAND TOTAL:</span>
                    <span className="text-green-600 text-base">₹{netTotal}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-[10px] text-slate-500">
                <div className="space-y-1.5">
                  <span className="font-black text-slate-700 uppercase tracking-wide block">Terms & Conditions:</span>
                  <p>1. All estimates are valid for 7 days from the date of compilation.</p>
                  <p>2. Spares once fitted cannot be taken back or exchanged.</p>
                  <p>3. Delivery dates are subject to availability of parts in stock.</p>
                  <p>4. Vehicles parked in the garage are solely at the owner's risk.</p>
                </div>
                <div className="flex justify-between items-end pt-8 md:pt-0">
                  <div className="text-center w-28 border-t border-slate-300 pt-1 text-slate-750 font-bold">
                    Customer Signature
                  </div>
                  <div className="text-center w-28 border-t border-slate-300 pt-1 text-slate-750 font-bold">
                    Verified Signature
                  </div>
                  <div className="text-center w-36 border-t border-slate-300 pt-1 text-slate-900 font-extrabold uppercase">
                    Authorised Signatory
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-8 border-t border-slate-100">
                <h5 className="font-black tracking-widest text-slate-700 text-xs">THANK YOU FOR YOUR VISIT</h5>
                <p className="text-[9px] text-slate-400 mt-1 font-bold">Powered by LeOmm Labs &nbsp;|&nbsp; &copy; Copyright LeOmm Labs 2026. All rights reserved.</p>
              </div>

            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-900 border-t border-slate-700/80 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    triggerToast("Invoice share link copied to clipboard!", "success");
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share link</span>
                </button>
                <button
                  onClick={() => {
                    triggerToast("Compiling PDF. Select 'Save as PDF' inside the destination menu!", "success");
                    setTimeout(() => printInvoice(), 200);
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    triggerToast("Preparing Print dialog. Set destination to your workshop invoice printer!", "success");
                    setTimeout(() => printInvoice(), 200);
                  }}
                  className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-xs transition-colors shadow-lg active:scale-95"
                >
                  Print Bill
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SELECT FORMAT TYPE MODAL */}
      {/* ============================================================ */}
      {isEstTypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <Printer className="h-5 w-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">Select Print Format</h3>
              </div>
              <button
                onClick={() => setIsEstTypeModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center p-4 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="estType"
                  value="all_inclusive"
                  checked={estimationType === "all_inclusive"}
                  onChange={() => setEstimationType("all_inclusive")}
                  className="h-4 w-4 text-green-500 focus:ring-green-500/20"
                />
                <div className="ml-3">
                  <span className="text-xs font-black text-slate-800 dark:text-white block">All Inclusive Estimate</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Taxes are integrated into item unit prices. Sleek and clean.</span>
                </div>
              </label>

              <label className="flex items-center p-4 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="estType"
                  value="tax_estimation"
                  checked={estimationType === "tax_estimation"}
                  onChange={() => setEstimationType("tax_estimation")}
                  className="h-4 w-4 text-green-500 focus:ring-green-500/20"
                />
                <div className="ml-3">
                  <span className="text-xs font-black text-slate-800 dark:text-white block">Tax-Estimation (Broken down GST)</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Standard invoice with broken out 9% CGST + 9% SGST lines.</span>
                </div>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsEstTypeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-350 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEstTypeModalOpen(false);
                  handlePrintPdf();
                }}
                className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-xs shadow-lg shadow-green-500/20"
              >
                Compile Format
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MANAGE OPS SLIDE-IN PANEL */}
      {/* ============================================================ */}
      {isManagePanelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsManagePanelOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-800 border-l border-slate-700 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-400">
                <Settings className="h-5 w-5 animate-spin-slow" />
                <h3 className="text-sm font-black uppercase tracking-wider">Manage Operations Panel</h3>
              </div>
              <button
                onClick={() => setIsManagePanelOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sidebar Tabs */}
            <div className="flex bg-slate-900 border-b border-slate-750 px-2 py-1">
              <button
                onClick={() => setManagePanelTab("inspection")}
                className={`flex-1 py-2 text-center text-xs font-black transition-colors ${
                  managePanelTab === "inspection" ? "text-green-400 border-b-2 border-green-500 font-extrabold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🔍 101-Point Inspection
              </button>
              <button
                onClick={() => setManagePanelTab("allocations")}
                className={`flex-1 py-2 text-center text-xs font-black transition-colors ${
                  managePanelTab === "allocations" ? "text-green-400 border-b-2 border-green-500 font-extrabold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                👥 Staff Allocations
              </button>
              <button
                onClick={() => setManagePanelTab("masters")}
                className={`flex-1 py-2 text-center text-xs font-black transition-colors ${
                  managePanelTab === "masters" ? "text-green-400 border-b-2 border-green-500 font-extrabold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚙️ Master Catalogues
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* TAB 1: 101-POINT INSPECTION */}
              {managePanelTab === "inspection" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-700/50 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">DVI Completion Progress</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-32 bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${(inspectionItems.filter(i => i.status === "ok").length / inspectionItems.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-white">
                          {Math.round((inspectionItems.filter(i => i.status === "ok").length / inspectionItems.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 uppercase font-bold">101-Point DVI Verified</span>
                  </div>

                  <div className="space-y-3">
                    {["Engine", "Brakes", "Suspension", "Electricals"].map((category) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">{category} Division Checklist</h4>
                        <div className="space-y-2">
                          {inspectionItems
                            .filter((item) => item.category === category)
                            .map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                                <span className="font-semibold text-slate-200">{item.name}</span>
                                <div className="flex space-x-1.5 shrink-0">
                                  <button
                                    onClick={() => {
                                      const updated = [...inspectionItems];
                                      const found = updated.find(i => i.name === item.name);
                                      if (found) found.status = "ok";
                                      setInspectionItems(updated);
                                      triggerToast(`Checked ${item.name} as OK`, "success");
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all uppercase ${
                                      item.status === "ok" ? "bg-green-500 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                                  >
                                    OK
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updated = [...inspectionItems];
                                      const found = updated.find(i => i.name === item.name);
                                      if (found) found.status = "attention";
                                      setInspectionItems(updated);
                                      triggerToast(`Checked ${item.name} as Attention Needed`, "info");
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all uppercase ${
                                      item.status === "attention" ? "bg-amber-500 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                                  >
                                    WARN
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updated = [...inspectionItems];
                                      const found = updated.find(i => i.name === item.name);
                                      if (found) found.status = "critical";
                                      setInspectionItems(updated);
                                      triggerToast(`Checked ${item.name} as Critical Action Required!`, "warn");
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all uppercase ${
                                      item.status === "critical" ? "bg-red-500 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                                  >
                                    FAIL
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: STAFF ALLOCATIONS */}
              {managePanelTab === "allocations" && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Allocate Service Personnel</span>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-500 mb-1">Technician / Mechanic In Charge</label>
                        <select
                          value={job.technician}
                          onChange={async (e) => {
                            setJob({ ...job, technician: e.target.value });
                            await fetch(`${API_BASE_URL}/job-cards/${job.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...getAuthHeaders() }, body: JSON.stringify({ technician: e.target.value }) });
                            triggerToast(`Reassigned Technician to ${e.target.value}`, "info");
                          }}
                          className="px-3.5 py-2.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-bold"
                        >
                          {employeesList.filter(e => e.role === "technician").map(e => (
                            <option key={e.id} value={e.name}>{e.name}</option>
                          ))}
                          {employeesList.filter(e => e.role === "technician").length === 0 && <option value="">No technicians in DB</option>}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-500 mb-1">Supervisor / Service Advisor</label>
                        <select
                          value={job.advisor}
                          onChange={async (e) => {
                            setJob({ ...job, advisor: e.target.value });
                            await fetch(`${API_BASE_URL}/job-cards/${job.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...getAuthHeaders() }, body: JSON.stringify({ advisor: e.target.value }) });
                            triggerToast(`Reassigned Advisor to ${e.target.value}`, "info");
                          }}
                          className="px-3.5 py-2.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-bold"
                        >
                          {employeesList.filter(e => e.role === "advisor").map(e => (
                            <option key={e.id} value={e.name}>{e.name}</option>
                          ))}
                          {employeesList.filter(e => e.role === "advisor").length === 0 && <option value="">No advisors in DB</option>}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MASTER CATALOGUES */}
              {managePanelTab === "masters" && (
                <div className="space-y-6">
                  
                  {/* Spares Master addition form */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">Add to Spare Parts Inventory Master</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">Part Name*</label>
                        <input
                          type="text"
                          value={newPartMasterForm.name}
                          onChange={(e) => setNewPartMasterForm({ ...newPartMasterForm, name: e.target.value })}
                          placeholder="e.g. Brake Lever Left"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">Part Number*</label>
                        <input
                          type="text"
                          value={newPartMasterForm.partNo}
                          onChange={(e) => setNewPartMasterForm({ ...newPartMasterForm, partNo: e.target.value })}
                          placeholder="e.g. BP-HON-402"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">Price (₹)*</label>
                        <input
                          type="number"
                          value={newPartMasterForm.price}
                          onChange={(e) => setNewPartMasterForm({ ...newPartMasterForm, price: e.target.value })}
                          placeholder="Cost"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">MRP Price (₹)*</label>
                        <input
                          type="number"
                          value={newPartMasterForm.mrp}
                          onChange={(e) => setNewPartMasterForm({ ...newPartMasterForm, mrp: e.target.value })}
                          placeholder="Max Retail"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!newPartMasterForm.name || !newPartMasterForm.partNo || !newPartMasterForm.price || !newPartMasterForm.mrp) {
                          triggerToast("Please fill all fields for parts master", "warn");
                          return;
                        }
                        try {
                          const res = await fetch(`${API_BASE_URL}/spare-parts`, {
                            method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
                            body: JSON.stringify(newPartMasterForm),
                          });
                          if (res.ok) {
                            const p = await res.json();
                            setSparesCatalog(prev => [p, ...prev]);
                            setNewPartMasterForm({ name: "", partNo: "", price: "", mrp: "", stock: "50", hsn: "HSN-8708" });
                            triggerToast("Spare part saved to DB!", "success");
                          } else { triggerToast("Failed to save part", "warn"); }
                        } catch { triggerToast("Save failed - check connection", "warn"); }
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-xl transition-colors shadow-sm"
                    >
                      Save to Spares Inventory Catalog
                    </button>
                  </div>

                  {/* Services Master addition form */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-wider block">Add to Labor Services Master</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">Service/Labor Name*</label>
                        <input
                          type="text"
                          value={newServiceMasterForm.name}
                          onChange={(e) => setNewServiceMasterForm({ ...newServiceMasterForm, name: e.target.value })}
                          placeholder="e.g. Brake Caliper Overhaul"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">Service Code*</label>
                        <input
                          type="text"
                          value={newServiceMasterForm.code}
                          onChange={(e) => setNewServiceMasterForm({ ...newServiceMasterForm, code: e.target.value })}
                          placeholder="e.g. SRV-BRK-08"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">Standard Labor Rate (₹)*</label>
                        <input
                          type="number"
                          value={newServiceMasterForm.rate}
                          onChange={(e) => setNewServiceMasterForm({ ...newServiceMasterForm, rate: e.target.value })}
                          placeholder="Rate"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-500 mb-1">SAC Code</label>
                        <input
                          type="text"
                          value={newServiceMasterForm.sac}
                          onChange={(e) => setNewServiceMasterForm({ ...newServiceMasterForm, sac: e.target.value })}
                          placeholder="SAC"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!newServiceMasterForm.name || !newServiceMasterForm.code || !newServiceMasterForm.rate) {
                          triggerToast("Please fill all fields for services master", "warn");
                          return;
                        }
                        try {
                          const res = await fetch(`${API_BASE_URL}/services-master`, {
                            method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
                            body: JSON.stringify(newServiceMasterForm),
                          });
                          if (res.ok) {
                            const s = await res.json();
                            setServicesCatalog(prev => [s, ...prev]);
                            setNewServiceMasterForm({ name: "", code: "", rate: "", sac: "SAC-9987" });
                            triggerToast("Service saved to DB!", "success");
                          } else { triggerToast("Failed to save service", "warn"); }
                        } catch { triggerToast("Save failed - check connection", "warn"); }
                      }}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] rounded-xl transition-colors shadow-sm"
                    >
                      Save to Services Labor Master
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-700/80 flex justify-end">
              <button
                onClick={() => setIsManagePanelOpen(false)}
                className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-slate-900 font-extrabold text-xs transition-colors shadow-sm"
              >
                Close Ops Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TOAST NOTIFICATIONS */}
      {/* ============================================================ */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-2xl border flex items-start space-x-3 pointer-events-auto ${
              t.type === "success" ? "bg-green-500 text-slate-900 border-green-400" : "bg-slate-800 text-slate-100 border-slate-700"
            }`}
          >
            {t.type === "success" ? <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" /> : <Clock className="h-5 w-5 mt-0.5 shrink-0" />}
            <span className="text-xs font-bold leading-relaxed">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
