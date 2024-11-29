export const mapProfileType = (value: string): string => {
  const profileTypeMap: Record<string, string> = {
    'criador': 'creator',
    'empreendedor': 'entrepreneur',
    'profissional': 'marketer',
    'creator': 'creator',
    'entrepreneur': 'entrepreneur',
    'marketer': 'marketer'
  };
  return profileTypeMap[value] || value;
};

export const mapBrandStatus = (value: string): string => {
  const brandStatusMap: Record<string, string> = {
    'ideia': 'idea',
    'em_desenvolvimento': 'in_development',
    'pronto_para_lancar': 'ready_to_launch',
    'idea': 'idea',
    'in_development': 'in_development',
    'ready_to_launch': 'ready_to_launch'
  };
  return brandStatusMap[value] || value;
};

export const mapLaunchUrgency = (value: string): string => {
  const urgencyMap: Record<string, string> = {
    'imediato': 'immediate',
    '3_meses': '3_months',
    '6_meses': '6_months',
    'immediate': 'immediate',
    '3_months': '3_months',
    '6_months': '6_months'
  };
  return urgencyMap[value] || value;
};