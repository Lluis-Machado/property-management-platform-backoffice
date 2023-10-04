const TooltipCostTypeColor = (data: string): string => {
    const colors: any = {
        BAT: 'bg-red-300',
        BAV: 'bg-orange-300',
        UAT: 'bg-green-300',
        UAV: 'bg-lime-300',
        NA: 'bg-cyan-300',
        Aktiv: 'bg-purple-300',
        Asset: 'bg-blue-300',
    };
    return colors[data];
};

export default TooltipCostTypeColor;
