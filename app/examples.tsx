export function ExMachineRoom() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Room outline */}
      <rect x="20" y="20" width="200" height="130" rx="4" stroke="#94a3b8" strokeWidth="2" fill="#f8fafc"/>
      {/* Machine (traction motor) */}
      <ellipse cx="90" cy="95" rx="32" ry="32" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5"/>
      <ellipse cx="90" cy="95" rx="18" ry="18" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="90" y1="63" x2="90" y2="45" stroke="#64748b" strokeWidth="2"/>
      <rect x="80" y="40" width="20" height="8" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
      {/* Control panel */}
      <rect x="150" y="60" width="45" height="65" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      <rect x="155" y="66" width="35" height="20" rx="2" fill="#bfdbfe"/>
      <circle cx="162" cy="96" r="3" fill="#3b82f6"/>
      <circle cx="174" cy="96" r="3" fill="#3b82f6"/>
      <circle cx="186" cy="96" r="3" fill="#3b82f6"/>
      {/* Camera icon in corner */}
      <g transform="translate(22,22)">
        <rect x="0" y="4" width="20" height="15" rx="2" fill="#1e3a5f" opacity="0.8"/>
        <circle cx="10" cy="11.5" r="4" fill="#60a5fa"/>
        <circle cx="10" cy="11.5" r="2" fill="#bfdbfe"/>
        <rect x="6" y="2" width="8" height="4" rx="1" fill="#1e3a5f" opacity="0.8"/>
      </g>
      {/* Camera angle lines */}
      <line x1="42" y1="36" x2="90" y2="80" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
      <line x1="42" y1="36" x2="158" y2="65" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
      {/* Label */}
      <text x="90" y="148" textAnchor="middle" fontSize="10" fill="#64748b">Stand in corner, capture full machine room</text>
    </svg>
  );
}

export function ExControlCabinet() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Cabinet body */}
      <rect x="60" y="15" width="120" height="130" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/>
      {/* Open door (angled) */}
      <path d="M60 15 L20 25 L20 140 L60 145" stroke="#64748b" strokeWidth="2" fill="#f1f5f9"/>
      {/* Interior components */}
      <rect x="70" y="25" width="100" height="35" rx="2" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1"/>
      <line x1="75" y1="35" x2="165" y2="35" stroke="#93c5fd" strokeWidth="1"/>
      <line x1="75" y1="45" x2="165" y2="45" stroke="#93c5fd" strokeWidth="1"/>
      <line x1="75" y1="52" x2="140" y2="52" stroke="#93c5fd" strokeWidth="1"/>
      {/* Contactor/relay blocks */}
      <rect x="70" y="68" width="22" height="22" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1"/>
      <rect x="98" y="68" width="22" height="22" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1"/>
      <rect x="126" y="68" width="22" height="22" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1"/>
      <rect x="154" y="68" width="16" height="22" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
      {/* Wiring */}
      <line x1="80" y1="90" x2="80" y2="110" stroke="#374151" strokeWidth="1.5"/>
      <line x1="109" y1="90" x2="109" y2="110" stroke="#374151" strokeWidth="1.5"/>
      <line x1="137" y1="90" x2="137" y2="110" stroke="#374151" strokeWidth="1.5"/>
      <line x1="80" y1="110" x2="137" y2="110" stroke="#374151" strokeWidth="1.5"/>
      {/* 1m distance label */}
      <line x1="185" y1="80" x2="220" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2"/>
      <line x1="185" y1="76" x2="185" y2="84" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="212" y="76" fontSize="9" fill="#ef4444" textAnchor="middle">1 m</text>
      {/* Label */}
      <text x="120" y="155" textAnchor="middle" fontSize="10" fill="#64748b">Door open · stand 1 m away</text>
    </svg>
  );
}

export function ExNameplate() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background surface */}
      <rect x="20" y="20" width="200" height="120" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
      {/* Nameplate */}
      <rect x="55" y="40" width="130" height="80" rx="3" fill="#fef9ee" stroke="#d97706" strokeWidth="2"/>
      <rect x="60" y="45" width="120" height="15" rx="1" fill="#fef3c7"/>
      <text x="120" y="57" textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold">MANUFACTURER NAME</text>
      <line x1="62" y1="65" x2="178" y2="65" stroke="#d97706" strokeWidth="0.8"/>
      <text x="68" y="76" fontSize="8" fill="#374151">Speed:</text>
      <text x="130" y="76" fontSize="8" fill="#1e293b" fontWeight="bold">1.5 m/s</text>
      <text x="68" y="88" fontSize="8" fill="#374151">Load:</text>
      <text x="130" y="88" fontSize="8" fill="#1e293b" fontWeight="bold">1000 kg</text>
      <text x="68" y="100" fontSize="8" fill="#374151">Power:</text>
      <text x="130" y="100" fontSize="8" fill="#1e293b" fontWeight="bold">15 kW</text>
      <text x="68" y="112" fontSize="8" fill="#374151">S/N:</text>
      <text x="130" y="112" fontSize="8" fill="#1e293b" fontWeight="bold">ABC-12345</text>
      {/* 20cm arrow */}
      <line x1="55" y1="130" x2="55" y2="148" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1="55" y1="148" x2="185" y2="148" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2"/>
      <line x1="185" y1="130" x2="185" y2="148" stroke="#3b82f6" strokeWidth="1.5"/>
      <text x="120" y="158" textAnchor="middle" fontSize="9" fill="#3b82f6">~20 cm distance</text>
    </svg>
  );
}

export function ExBrakeNameplate() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Brake assembly */}
      <rect x="60" y="30" width="120" height="50" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/>
      {/* Coil */}
      <rect x="75" y="40" width="40" height="30" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      <text x="95" y="59" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="bold">COIL</text>
      {/* Armature plates */}
      <rect x="125" y="38" width="40" height="8" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
      <rect x="125" y="50" width="40" height="8" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
      <rect x="125" y="62" width="40" height="8" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
      {/* Nameplate on brake */}
      <rect x="68" y="90" width="104" height="50" rx="3" fill="#fef9ee" stroke="#d97706" strokeWidth="1.5"/>
      <text x="120" y="104" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="bold">BRAKE NAMEPLATE</text>
      <line x1="70" y1="108" x2="170" y2="108" stroke="#d97706" strokeWidth="0.8"/>
      <text x="76" y="119" fontSize="8" fill="#374151">Voltage:</text>
      <text x="140" y="119" fontSize="8" fill="#1e293b" fontWeight="bold">110 V DC</text>
      <text x="76" y="131" fontSize="8" fill="#374151">Power:</text>
      <text x="140" y="131" fontSize="8" fill="#1e293b" fontWeight="bold">60 W</text>
    </svg>
  );
}

export function ExEncoder() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left: encoder nameplate */}
      <rect x="15" y="20" width="95" height="120" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="62" y="36" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">① NAMEPLATE</text>
      <rect x="25" y="42" width="75" height="88" rx="3" fill="#fef9ee" stroke="#d97706" strokeWidth="1.5"/>
      <text x="62" y="57" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">ENCODER</text>
      <line x1="27" y1="62" x2="98" y2="62" stroke="#d97706" strokeWidth="0.8"/>
      <text x="30" y="74" fontSize="7" fill="#374151">Model:</text>
      <text x="68" y="74" fontSize="7" fill="#1e293b">ER-2048</text>
      <text x="30" y="85" fontSize="7" fill="#374151">PPR:</text>
      <text x="68" y="85" fontSize="7" fill="#1e293b">2048</text>
      <text x="30" y="96" fontSize="7" fill="#374151">Voltage:</text>
      <text x="68" y="96" fontSize="7" fill="#1e293b">5-24V</text>
      <text x="30" y="107" fontSize="7" fill="#374151">Output:</text>
      <text x="68" y="107" fontSize="7" fill="#1e293b">ABZ</text>
      {/* Right: encoder on machine */}
      <rect x="125" y="20" width="100" height="120" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="175" y="36" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">② ON MACHINE</text>
      {/* Motor body */}
      <ellipse cx="175" cy="105" rx="30" ry="30" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5"/>
      <ellipse cx="175" cy="105" rx="18" ry="18" fill="#cbd5e1" stroke="#64748b" strokeWidth="1"/>
      {/* Encoder attached to shaft */}
      <rect x="188" y="48" width="22" height="22" rx="11" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      <circle cx="199" cy="59" r="5" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
      <line x1="199" y1="70" x2="199" y2="80" stroke="#64748b" strokeWidth="2"/>
      <line x1="175" y1="75" x2="199" y2="80" stroke="#64748b" strokeWidth="1.5"/>
      <text x="175" y="152" textAnchor="middle" fontSize="9" fill="#3b82f6">Nameplate + installed position</text>
    </svg>
  );
}

export function ExDoorOperator() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Door frame */}
      <rect x="50" y="15" width="140" height="130" rx="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="2"/>
      {/* Door panels - closed */}
      <rect x="52" y="17" width="68" height="126" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
      <rect x="120" y="17" width="68" height="126" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
      {/* Door gap */}
      <line x1="120" y1="17" x2="120" y2="143" stroke="#64748b" strokeWidth="1.5"/>
      {/* Door operator on top */}
      <rect x="50" y="5" width="140" height="20" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      <text x="120" y="18" textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="bold">DOOR OPERATOR</text>
      {/* Belt/motor indication */}
      <circle cx="70" cy="15" r="6" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
      <circle cx="170" cy="15" r="6" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
      <line x1="70" y1="9" x2="170" y2="9" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1="70" y1="21" x2="170" y2="21" stroke="#3b82f6" strokeWidth="1.5"/>
      {/* Hall side label */}
      <text x="120" y="85" textAnchor="middle" fontSize="9" fill="#94a3b8">HALL SIDE</text>
      {/* Camera position */}
      <g transform="translate(108, 130)">
        <rect x="0" y="0" width="14" height="10" rx="1.5" fill="#1e3a5f" opacity="0.75"/>
        <circle cx="7" cy="5" r="3" fill="#60a5fa"/>
        <rect x="4" y="-3" width="6" height="3" rx="1" fill="#1e3a5f" opacity="0.75"/>
      </g>
      <text x="120" y="155" textAnchor="middle" fontSize="9" fill="#64748b">Shoot from hall side, door closed</text>
    </svg>
  );
}

export function ExTimingBelt() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Door operator housing */}
      <rect x="25" y="20" width="190" height="50" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      {/* Drive pulley left */}
      <circle cx="60" cy="45" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/>
      <circle cx="60" cy="45" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5"/>
      {/* Driven pulley right */}
      <circle cx="180" cy="45" r="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/>
      <circle cx="180" cy="45" r="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5"/>
      {/* Belt */}
      <path d="M60 27 L180 31" stroke="#374151" strokeWidth="3"/>
      <path d="M60 63 L180 59" stroke="#374151" strokeWidth="3"/>
      {/* Red measurement box */}
      <rect x="55" y="68" width="135" height="60" rx="3" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3"/>
      <text x="122" y="85" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">MEASURE HERE</text>
      {/* Tape measure */}
      <rect x="55" y="90" width="135" height="14" rx="2" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5"/>
      <line x1="65" y1="90" x2="65" y2="104" stroke="#ca8a04" strokeWidth="1"/>
      <line x1="78" y1="90" x2="78" y2="101" stroke="#ca8a04" strokeWidth="0.8"/>
      <line x1="91" y1="90" x2="91" y2="104" stroke="#ca8a04" strokeWidth="1"/>
      <line x1="104" y1="90" x2="104" y2="101" stroke="#ca8a04" strokeWidth="0.8"/>
      <line x1="117" y1="90" x2="117" y2="104" stroke="#ca8a04" strokeWidth="1"/>
      <line x1="130" y1="90" x2="130" y2="101" stroke="#ca8a04" strokeWidth="0.8"/>
      <line x1="143" y1="90" x2="143" y2="104" stroke="#ca8a04" strokeWidth="1"/>
      <line x1="156" y1="90" x2="156" y2="101" stroke="#ca8a04" strokeWidth="0.8"/>
      <line x1="169" y1="90" x2="169" y2="104" stroke="#ca8a04" strokeWidth="1"/>
      <line x1="182" y1="90" x2="182" y2="101" stroke="#ca8a04" strokeWidth="0.8"/>
      {/* Width measurement arrow */}
      <line x1="55" y1="112" x2="190" y2="112" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1="55" y1="108" x2="55" y2="116" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1="190" y1="108" x2="190" y2="116" stroke="#3b82f6" strokeWidth="1.5"/>
      <text x="122" y="130" textAnchor="middle" fontSize="9" fill="#3b82f6">Belt width</text>
      <text x="122" y="145" textAnchor="middle" fontSize="9" fill="#64748b">Door closed · tape measure in place</text>
    </svg>
  );
}

export function ExMotorModel() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left: nameplate */}
      <rect x="10" y="20" width="100" height="120" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="60" y="36" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">① NAMEPLATE</text>
      <rect x="18" y="42" width="84" height="90" rx="3" fill="#fef9ee" stroke="#d97706" strokeWidth="1.5"/>
      <text x="60" y="56" textAnchor="middle" fontSize="7.5" fill="#92400e" fontWeight="bold">DOOR MOTOR</text>
      <line x1="20" y1="61" x2="100" y2="61" stroke="#d97706" strokeWidth="0.8"/>
      <text x="22" y="72" fontSize="7" fill="#374151">Model:</text>
      <text x="58" y="72" fontSize="7" fill="#1e293b">YJ-90</text>
      <text x="22" y="83" fontSize="7" fill="#374151">Power:</text>
      <text x="58" y="83" fontSize="7" fill="#1e293b">90 W</text>
      <text x="22" y="94" fontSize="7" fill="#374151">Voltage:</text>
      <text x="58" y="94" fontSize="7" fill="#1e293b">220 V</text>
      <text x="22" y="105" fontSize="7" fill="#374151">Speed:</text>
      <text x="58" y="105" fontSize="7" fill="#1e293b">1400 rpm</text>
      <text x="22" y="116" fontSize="7" fill="#374151">Current:</text>
      <text x="58" y="116" fontSize="7" fill="#1e293b">0.8 A</text>
      {/* Right: installation position */}
      <rect x="125" y="20" width="105" height="120" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="177" y="36" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">② POSITION</text>
      {/* Door operator frame */}
      <rect x="133" y="42" width="89" height="88" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* Motor shape */}
      <rect x="145" y="60" width="30" height="45" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      <ellipse cx="160" cy="60" rx="15" ry="8" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5"/>
      {/* Shaft */}
      <line x1="175" y1="82" x2="192" y2="82" stroke="#64748b" strokeWidth="3"/>
      {/* Pulley */}
      <circle cx="198" cy="82" r="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5"/>
      {/* Arrow pointing to motor */}
      <line x1="152" y1="115" x2="152" y2="130" stroke="#ef4444" strokeWidth="1.5"/>
      <polygon points="152,136 148,128 156,128" fill="#ef4444"/>
      <text x="177" y="152" textAnchor="middle" fontSize="8" fill="#64748b">Nameplate + installation</text>
    </svg>
  );
}

export function ExControllerWiring() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left panel: door operator wiring */}
      <rect x="10" y="15" width="105" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="62" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">① DOOR OP. WIRING</text>
      {/* Controller box */}
      <rect x="20" y="38" width="85" height="55" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      <text x="62" y="52" textAnchor="middle" fontSize="7" fill="#1d4ed8">Door Controller</text>
      {/* Terminals */}
      <rect x="25" y="58" width="12" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <rect x="42" y="58" width="12" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <rect x="59" y="58" width="12" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <rect x="76" y="58" width="12" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      {/* Wires going down */}
      <line x1="31" y1="66" x2="31" y2="100" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1="48" y1="66" x2="48" y2="100" stroke="#374151" strokeWidth="1.5"/>
      <line x1="65" y1="66" x2="65" y2="100" stroke="#2563eb" strokeWidth="1.5"/>
      <line x1="82" y1="66" x2="82" y2="100" stroke="#16a34a" strokeWidth="1.5"/>
      <text x="62" y="115" textAnchor="middle" fontSize="7" fill="#64748b">Wiring connections</text>
      {/* Right panel: schematic */}
      <rect x="125" y="15" width="105" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="177" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">② SCHEMATIC</text>
      {/* Simple schematic lines */}
      <rect x="135" y="38" width="85" height="90" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1"/>
      <line x1="145" y1="55" x2="210" y2="55" stroke="#374151" strokeWidth="1"/>
      <line x1="145" y1="68" x2="210" y2="68" stroke="#374151" strokeWidth="1"/>
      <line x1="145" y1="81" x2="210" y2="81" stroke="#374151" strokeWidth="1"/>
      <line x1="145" y1="94" x2="210" y2="94" stroke="#374151" strokeWidth="1"/>
      <circle cx="162" cy="55" r="3" fill="none" stroke="#374151" strokeWidth="1"/>
      <circle cx="162" cy="68" r="3" fill="none" stroke="#374151" strokeWidth="1"/>
      <rect x="178" y="62" width="16" height="12" rx="1" fill="none" stroke="#374151" strokeWidth="1"/>
      <text x="177" y="115" textAnchor="middle" fontSize="7" fill="#64748b">Door op. section</text>
      <text x="177" y="126" textAnchor="middle" fontSize="7" fill="#64748b">in main schematic</text>
    </svg>
  );
}

export function ExOperationBox() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left: front face */}
      <rect x="10" y="15" width="100" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="60" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">① FRONT FACE</text>
      {/* COP panel */}
      <rect x="22" y="38" width="76" height="98" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5"/>
      {/* Floor buttons */}
      {[0,1,2,3].map(row =>
        [0,1,2].map(col => (
          <rect key={`${row}-${col}`} x={30 + col*22} y={46 + row*18} width="16" height="12" rx="3" fill="#334155" stroke="#475569" strokeWidth="1"/>
        ))
      )}
      {/* Display */}
      <rect x="26" y="120" width="68" height="10" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1"/>
      <text x="60" y="128" textAnchor="middle" fontSize="7" fill="#22d3ee">12F  ▲</text>
      {/* Right: installation position */}
      <rect x="125" y="15" width="105" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="177" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">② POSITION</text>
      {/* Car interior sketch */}
      <rect x="135" y="38" width="85" height="98" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* COP on wall */}
      <rect x="195" y="55" width="18" height="65" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.5"/>
      <rect x="197" y="60" width="14" height="8" rx="1.5" fill="#334155"/>
      <rect x="197" y="72" width="14" height="8" rx="1.5" fill="#334155"/>
      <rect x="197" y="84" width="14" height="8" rx="1.5" fill="#334155"/>
      {/* Arrow pointing to it */}
      <line x1="185" y1="88" x2="196" y2="88" stroke="#ef4444" strokeWidth="1.5"/>
      <polygon points="196,88 190,85 190,91" fill="#ef4444"/>
    </svg>
  );
}

export function ExHallDoor() {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left: hall door front */}
      <rect x="10" y="15" width="100" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="60" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">① HALL DOOR FRONT</text>
      {/* Door surround */}
      <rect x="22" y="38" width="76" height="98" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* Left door panel */}
      <rect x="24" y="40" width="36" height="94" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
      {/* Right door panel */}
      <rect x="60" y="40" width="36" height="94" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
      {/* Door gap */}
      <line x1="60" y1="40" x2="60" y2="134" stroke="#64748b" strokeWidth="1.5"/>
      {/* Sill */}
      <rect x="22" y="132" width="76" height="4" rx="1" fill="#94a3b8"/>
      {/* Right: hall call position */}
      <rect x="125" y="15" width="105" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
      <text x="177" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">② HALL CALL</text>
      {/* Wall with door frame */}
      <rect x="135" y="38" width="85" height="98" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* Door frame */}
      <rect x="155" y="40" width="45" height="96" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
      {/* Hall call button panel */}
      <rect x="143" y="70" width="10" height="30" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
      <circle cx="148" cy="78" r="4" fill="#22c55e" stroke="#16a34a" strokeWidth="1"/>
      <circle cx="148" cy="92" r="4" fill="#ef4444" stroke="#dc2626" strokeWidth="1"/>
      {/* Arrow */}
      <line x1="162" y1="85" x2="154" y2="85" stroke="#ef4444" strokeWidth="1.5"/>
      <polygon points="154,85 160,82 160,88" fill="#ef4444"/>
      <text x="177" y="148" textAnchor="middle" fontSize="8" fill="#64748b">Hall call button position</text>
    </svg>
  );
}
