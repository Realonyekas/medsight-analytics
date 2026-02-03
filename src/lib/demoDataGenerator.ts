// Demo Data Generator for Sales Demo Mode
// Generates realistic hospital data for different hospital sizes

export type HospitalSize = 'clinic' | 'general' | 'state';

export interface DemoHospitalConfig {
  size: HospitalSize;
  name: string;
  totalBeds: number;
  occupancy: number;
  dailyPatients: number;
  departments: string[];
  staff: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

export interface DemoPatient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  department: string;
  admissionDate: Date;
  diagnosis: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timeline: DemoPatientEvent[];
}

export interface DemoPatientEvent {
  id: string;
  type: 'registration' | 'triage' | 'consultation' | 'lab' | 'pharmacy' | 'imaging' | 'discharge';
  title: string;
  timestamp: Date;
  department: string;
  status: 'completed' | 'in-progress' | 'pending';
  alert?: string;
}

export interface DemoInventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  expiryDate?: Date;
  unitCost: number;
  status: 'healthy' | 'low' | 'expired' | 'theft-flagged';
  potentialLoss?: number;
}

export interface DemoMetric {
  name: string;
  value: number;
  unit: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  category: 'clinical' | 'operational' | 'financial';
}

const hospitalConfigs: Record<HospitalSize, DemoHospitalConfig> = {
  clinic: {
    size: 'clinic',
    name: 'Premier Medical Clinic',
    totalBeds: 25,
    occupancy: 72,
    dailyPatients: 85,
    departments: ['General Practice', 'Pediatrics', 'Maternity', 'Laboratory'],
    staff: 45,
    monthlyRevenue: 15000000,
    monthlyExpenses: 12500000,
  },
  general: {
    size: 'general',
    name: 'City General Hospital',
    totalBeds: 150,
    occupancy: 78,
    dailyPatients: 320,
    departments: ['Emergency', 'Surgery', 'Internal Medicine', 'Pediatrics', 'OB/GYN', 'ICU', 'Laboratory', 'Radiology'],
    staff: 280,
    monthlyRevenue: 85000000,
    monthlyExpenses: 72000000,
  },
  state: {
    size: 'state',
    name: 'State Teaching Hospital',
    totalBeds: 500,
    occupancy: 82,
    dailyPatients: 1200,
    departments: ['Emergency', 'Surgery', 'Internal Medicine', 'Pediatrics', 'OB/GYN', 'ICU', 'Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Laboratory', 'Radiology', 'Pharmacy'],
    staff: 850,
    monthlyRevenue: 350000000,
    monthlyExpenses: 295000000,
  },
};

const nigerianFirstNames = ['Chioma', 'Emeka', 'Fatima', 'Adebayo', 'Ngozi', 'Oluwaseun', 'Aisha', 'Chukwudi', 'Zainab', 'Tunde', 'Amara', 'Ibrahim', 'Blessing', 'Olamide', 'Hauwa'];
const nigerianLastNames = ['Okonkwo', 'Adeyemi', 'Mohammed', 'Nnamdi', 'Bello', 'Eze', 'Usman', 'Okwu', 'Bakare', 'Danjuma', 'Igwe', 'Yusuf', 'Obi', 'Lawal', 'Adekunle'];
const diagnoses = ['Malaria (Severe)', 'Typhoid Fever', 'Diabetes Type 2', 'Hypertension', 'Pneumonia', 'Appendicitis', 'Fracture - Femur', 'Pregnancy (High Risk)', 'Sickle Cell Crisis', 'Dengue Fever'];

const drugNames = ['Artemether-Lumefantrine', 'Metformin 500mg', 'Amlodipine 5mg', 'Ciprofloxacin 500mg', 'Paracetamol 500mg', 'Amoxicillin 500mg', 'Omeprazole 20mg', 'Diclofenac 50mg', 'Insulin Mixtard', 'Lisinopril 10mg'];

export function getHospitalConfig(size: HospitalSize): DemoHospitalConfig {
  return hospitalConfigs[size];
}

export function generateDemoPatient(config: DemoHospitalConfig, index: number): DemoPatient {
  const firstName = nigerianFirstNames[Math.floor(Math.random() * nigerianFirstNames.length)];
  const lastName = nigerianLastNames[Math.floor(Math.random() * nigerianLastNames.length)];
  const age = Math.floor(Math.random() * 60) + 18;
  const gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const department = config.departments[Math.floor(Math.random() * config.departments.length)];
  const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
  const riskScore = Math.floor(Math.random() * 100);
  
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore >= 85) riskLevel = 'critical';
  else if (riskScore >= 65) riskLevel = 'high';
  else if (riskScore >= 35) riskLevel = 'medium';
  else riskLevel = 'low';

  const admissionDate = new Date();
  admissionDate.setHours(admissionDate.getHours() - Math.floor(Math.random() * 72));

  const timeline = generatePatientTimeline(admissionDate, department, riskLevel);

  return {
    id: `demo-patient-${index}`,
    mrn: `MRN${String(100000 + index).padStart(6, '0')}`,
    name: `${firstName} ${lastName}`,
    age,
    gender,
    department,
    admissionDate,
    diagnosis,
    riskScore,
    riskLevel,
    timeline,
  };
}

function generatePatientTimeline(admissionDate: Date, department: string, riskLevel: string): DemoPatientEvent[] {
  const events: DemoPatientEvent[] = [];
  let currentTime = new Date(admissionDate);

  // Registration
  events.push({
    id: 'evt-1',
    type: 'registration',
    title: 'Patient Registration',
    timestamp: new Date(currentTime),
    department: 'Front Desk',
    status: 'completed',
  });

  // Triage
  currentTime.setMinutes(currentTime.getMinutes() + 15);
  events.push({
    id: 'evt-2',
    type: 'triage',
    title: 'Initial Triage Assessment',
    timestamp: new Date(currentTime),
    department: 'Emergency',
    status: 'completed',
    alert: riskLevel === 'critical' ? '⚠️ High Priority - Immediate Attention Required' : undefined,
  });

  // Doctor Consultation
  currentTime.setMinutes(currentTime.getMinutes() + 30);
  events.push({
    id: 'evt-3',
    type: 'consultation',
    title: 'Doctor Consultation',
    timestamp: new Date(currentTime),
    department,
    status: 'completed',
  });

  // Lab Work
  currentTime.setHours(currentTime.getHours() + 1);
  events.push({
    id: 'evt-4',
    type: 'lab',
    title: 'Laboratory Tests',
    timestamp: new Date(currentTime),
    department: 'Laboratory',
    status: 'completed',
    alert: riskLevel !== 'low' ? '🔬 Abnormal Results Detected' : undefined,
  });

  // Pharmacy
  currentTime.setHours(currentTime.getHours() + 2);
  events.push({
    id: 'evt-5',
    type: 'pharmacy',
    title: 'Medication Dispensed',
    timestamp: new Date(currentTime),
    department: 'Pharmacy',
    status: 'in-progress',
  });

  // Discharge (pending)
  currentTime.setHours(currentTime.getHours() + 24);
  events.push({
    id: 'evt-6',
    type: 'discharge',
    title: 'Discharge Planning',
    timestamp: new Date(currentTime),
    department,
    status: 'pending',
  });

  return events;
}

export function generateDemoInventory(config: DemoHospitalConfig): DemoInventoryItem[] {
  const items: DemoInventoryItem[] = [];
  const multiplier = config.size === 'clinic' ? 1 : config.size === 'general' ? 3 : 8;

  drugNames.forEach((name, index) => {
    const isExpired = index === 2;
    const isLow = index === 4;
    const isTheftFlagged = index === 7;
    
    const currentStock = isLow ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 500) * multiplier;
    const minStock = 50 * multiplier;
    const maxStock = 1000 * multiplier;
    const unitCost = Math.floor(Math.random() * 5000) + 500;

    let status: 'healthy' | 'low' | 'expired' | 'theft-flagged' = 'healthy';
    let potentialLoss: number | undefined;

    if (isExpired) {
      status = 'expired';
      potentialLoss = currentStock * unitCost;
    } else if (isTheftFlagged) {
      status = 'theft-flagged';
      potentialLoss = Math.floor(Math.random() * 50) * unitCost;
    } else if (isLow || currentStock < minStock) {
      status = 'low';
    }

    const expiryDate = new Date();
    if (isExpired) {
      expiryDate.setMonth(expiryDate.getMonth() - 2);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 24) + 3);
    }

    items.push({
      id: `inv-${index}`,
      name,
      category: 'Medication',
      currentStock,
      minStock,
      maxStock,
      expiryDate,
      unitCost,
      status,
      potentialLoss,
    });
  });

  return items;
}

export function generateDemoMetrics(config: DemoHospitalConfig): DemoMetric[] {
  const savingsMultiplier = config.size === 'clinic' ? 1 : config.size === 'general' ? 4 : 12;
  
  return [
    {
      name: 'Active Patients',
      value: Math.floor(config.totalBeds * (config.occupancy / 100)),
      unit: 'patients',
      trend: 8,
      trendDirection: 'up',
      category: 'clinical',
    },
    {
      name: 'Bed Occupancy',
      value: config.occupancy,
      unit: '%',
      trend: 3,
      trendDirection: 'up',
      category: 'operational',
    },
    {
      name: 'Avg Length of Stay',
      value: 4.2,
      unit: 'days',
      trend: -12,
      trendDirection: 'down',
      category: 'clinical',
    },
    {
      name: 'Monthly Revenue',
      value: config.monthlyRevenue,
      unit: '₦',
      trend: 15,
      trendDirection: 'up',
      category: 'financial',
    },
    {
      name: 'Cost per Patient',
      value: Math.floor(config.monthlyExpenses / config.dailyPatients / 30),
      unit: '₦',
      trend: -8,
      trendDirection: 'down',
      category: 'financial',
    },
    {
      name: 'Readmission Rate',
      value: 3.2,
      unit: '%',
      trend: -22,
      trendDirection: 'down',
      category: 'clinical',
    },
    {
      name: 'Staff Utilization',
      value: 87,
      unit: '%',
      trend: 5,
      trendDirection: 'up',
      category: 'operational',
    },
    {
      name: 'Monthly Savings',
      value: 2500000 * savingsMultiplier,
      unit: '₦',
      trend: 34,
      trendDirection: 'up',
      category: 'financial',
    },
  ];
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `₦${(value / 1000).toFixed(0)}K`;
  }
  return `₦${value}`;
}

export function generateSavingsEstimate(config: DemoHospitalConfig): {
  monthlySavings: number;
  annualSavings: number;
  monthlyCost: number;
  roi: number;
} {
  const baseSavings = config.size === 'clinic' ? 2500000 : config.size === 'general' ? 12000000 : 45000000;
  const monthlyCost = config.size === 'clinic' ? 499000 : config.size === 'general' ? 1200000 : 3000000;
  
  return {
    monthlySavings: baseSavings,
    annualSavings: baseSavings * 12,
    monthlyCost,
    roi: Math.floor((baseSavings - monthlyCost) / monthlyCost * 100),
  };
}
