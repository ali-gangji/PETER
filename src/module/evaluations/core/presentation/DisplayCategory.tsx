import React from 'react';
import { Category } from '../domain/entity/Category';

interface Props {
  category: Category;
}

interface CategoryPresenter {
  shortName: string;
  name: string;
  description: string;
}

function DisplayCategory({ category }: Props) {
  const descriptions: Map<Category, CategoryPresenter> = new Map([
    [
      Category.X,
      {
        shortName: 'X',
        name: 'X',
        description:
          'Impacts from use phase (related to operating energy and movement) are not predominant. Manufacturing process alternatives may be for instance relevant to decrease the impacts. Yet it does not mean that the use phase must be neglected of forgotten. It simply means\n' +
          'environmental facts do not justify a priority action on those items',
      },
    ],
    [
      Category.E,
      {
        shortName: 'E',
        name: 'Energy',
        description:
          'Impacts of operating energy (i.e. caused by its production in power plants) consumed by the equipment prevail over the other life cycle aspects (e.g. manufacturing impacts).',
      },
    ],
    [
      Category.EM,
      {
        shortName: 'EM',
        name: 'Energy & Material/Movement',
        description:
          'Impacts from both operating energy and movement are important. Both aspects from the use phase are to be considered in priority.',
      },
    ],
    [
      Category.M,
      {
        shortName: 'M',
        name: 'Material/Movement',
        description:
          'Impacts of the product movement in use (i.e. caused by vehicles) along the whole life cycle overcome other all sources of impacts including the operating energy in use.',
      },
    ],
    [
      Category.NONE,
      {
        shortName: 'N/A',
        name: 'Not applicable',
        description: 'Cannot determine impact category based on current data.',
      },
    ],
  ]);

  const categoryInfo = descriptions.get(category);

  if (!categoryInfo) {
    return null; // Or a fallback UI
  }

  return (
    <div className="overflow-hidden border border-slate-200 rounded-lg">
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-slate-200">
            <td className="p-3 bg-slate-50 font-semibold text-slate-600 w-1/3">Category</td>
            <td className="p-3 font-bold text-hitachi-red text-lg">{categoryInfo.shortName}</td>
          </tr>
          <tr className="border-b border-slate-200">
            <td className="p-3 bg-slate-50 font-semibold text-slate-600 align-top">Name</td>
            <td className="p-3 text-slate-800">{categoryInfo.name}</td>
          </tr>
          <tr>
            <td className="p-3 bg-slate-50 font-semibold text-slate-600 align-top">Description</td>
            <td className="p-3 text-slate-600">{categoryInfo.description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DisplayCategory;
