const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8B739', '#6C5CE7', '#A29BFE', '#FD79A8',
];

export const RADIUS = 150;
export const CENTER_X = 400;
export const CENTER_Y = 300;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * 부채꼴을 공통 원점(0,0)에 두고 생성합니다.
 * 이후 배치는 translate/rotate로만 조정합니다.
 */
export function generateSectors(count) {
  const sectors = [];
  const angleStep = (2 * Math.PI) / count;
  const baseStart = -Math.PI / 2 - angleStep / 2; // 위쪽을 향하도록 기준 각도 설정
  const baseEnd = -Math.PI / 2 + angleStep / 2;

  for (let i = 0; i < count; i++) {
    sectors.push({
      id: `sector-${i}`,
      angle: angleStep,
      startAngle: baseStart,
      endAngle: baseEnd,
      color: COLORS[i % COLORS.length],
      x: CENTER_X,
      y: CENTER_Y,
      rotation: angleStep * i, // 360/N * i 만큼 회전
    });
  }

  return sectors;
}

/**
 * 중심이 (0,0)인 단일 부채꼴 path를 생성합니다.
 */
export function getSectorPath(sector, radius = RADIUS) {
  const half = sector.angle / 2;
  const start = -Math.PI / 2 - half;
  const end = -Math.PI / 2 + half;

  const x1 = radius * Math.cos(start);
  const y1 = radius * Math.sin(start);
  const x2 = radius * Math.cos(end);
  const y2 = radius * Math.sin(end);

  const largeArcFlag = sector.angle > Math.PI ? 1 : 0;

  return [
    'M 0 0',
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z',
  ].join(' ');
}

/**
 * 직사각형 형태(위/아래 교차) 배치를 계산합니다.
 * 크기는 유지한 채 translate/rotate만 수정합니다.
 */
export function calculateOptimalLayout(sectors, preserveColor = false, fitToScreen = false) {
  const count = sectors.length;
  if (count === 0) return sectors;

  // 각 조각의 호 길이 (반지름)
  const arcLength = RADIUS * (2 * Math.PI / count);
  let spacing = arcLength; // 반지름을 맞닿이게
  
  // 화면에 맞추기 (fitToScreen이 true일 때)
  if (fitToScreen) {
    const maxWidth = 700; // SVG viewBox 너비(800)에서 여백 고려
    const maxSpacing = maxWidth / (count - 1);
    if (spacing > maxSpacing) {
      spacing = maxSpacing;
    }
  }
  
  const totalWidth = spacing * (count - 1);
  const startX = CENTER_X - totalWidth / 2;
  const upperY = CENTER_Y - RADIUS / 2;
  const lowerY = CENTER_Y + RADIUS / 2;
  const halfWidth = totalWidth / 2;

  return sectors.map((sector, index) => {
    const isEven = index % 2 === 0;
    const x = startX + index * spacing;
    const y = isEven ? upperY : lowerY;
    
    // 색상 결정: preserveColor가 true면 원래 색상 유지, 아니면 가로 위치에 따라 변경
    let color = sector.color;
    if (!preserveColor) {
      const relativeX = x - (CENTER_X - halfWidth);
      const isLeftHalf = relativeX < halfWidth;
      color = isLeftHalf ? '#ef4444' : '#3b82f6';
    }

    return {
      ...sector,
      x,
      y,
      rotation: isEven ? 0 : Math.PI, // 짝수: 위쪽, 홀수: 아래쪽
      color,
    };
  });
}

export function calculateMeasurements(sectors) {
  if (sectors.length === 0) return { width: 0, height: 0 };

  const minX = Math.min(...sectors.map(s => s.x));
  const maxX = Math.max(...sectors.map(s => s.x));
  const minY = Math.min(...sectors.map(s => s.y));
  const maxY = Math.max(...sectors.map(s => s.y));

  return {
    width: maxX - minX,
    height: maxY - minY,
  };
}

