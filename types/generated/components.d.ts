import type { Schema, Struct } from '@strapi/strapi';

export interface SpectacleJournee extends Struct.ComponentSchema {
  collectionName: 'components_spectacle_journees';
  info: {
    description: 'Plusieurs seances le meme jour';
    displayName: 'Journee';
    icon: 'calendar';
  };
  attributes: {
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    seances: Schema.Attribute.Component<'spectacle.seance', true>;
  };
}

export interface SpectacleSeance extends Struct.ComponentSchema {
  collectionName: 'components_spectacle_seances';
  info: {
    description: 'Une representation a un horaire donne';
    displayName: 'Seance';
    icon: 'clock';
  };
  attributes: {
    startTime: Schema.Attribute.Time & Schema.Attribute.Required;
    weezeventIframeSrc: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'spectacle.journee': SpectacleJournee;
      'spectacle.seance': SpectacleSeance;
    }
  }
}
