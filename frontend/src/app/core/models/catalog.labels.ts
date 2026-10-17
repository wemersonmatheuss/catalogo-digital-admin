import { Gender } from './catalog.models';

export const GENDER_LABEL: Record<Gender, string> = {
  female: 'Feminino',
  male: 'Masculino',
};

export const GENDER_SLUG: Record<Gender, string> = {
  female: 'feminino',
  male: 'masculino',
};

export function genderFromSlug(slug: string | null): Gender | undefined | 'invalid' {
  if (!slug) {
    return undefined;
  }

  if (slug === GENDER_SLUG.female) {
    return 'female';
  }

  if (slug === GENDER_SLUG.male) {
    return 'male';
  }

  return 'invalid';
}

export function genderPath(gender: Gender, categorySlug?: string): string[] {
  const path = ['/produtos', GENDER_SLUG[gender]];
  if (categorySlug) {
    path.push(categorySlug);
  }
  return path;
}
