'use strict';
/**
 * ToGo custom config
 */
AgaveToGo
    /**
     * @ngdoc object
     * @name AgaveToGo.config:agaveToGoLayoutConfig
     *
     * @description
     * Default layout configuration for the UI. This handles basic
     * look and feel across all common components.
     */
    .constant('agaveToGoLayoutConfig', {
      /**
       * @ngdoc property
       * @name AgaveToGo.config.agaveToGoLayoutConfig#branding
       * @propertyOf AgaveToGo.config:agaveToGoLayoutConfig
       * @returns object 
       *
       * @description
       * Defines properties related to the organizational branding of the app
       */
      branding: {

        /**
         * @ngdoc property
         * @name AgaveToGo.config.agaveToGoLayoutConfig.branding.name
         * @propertyOf AgaveToGo.config.agaveToGoLayoutConfig:branding
         * @returns string
         *
         * @description
         * The name of the app as seen in the title and image hover.
         */
        name: "Agave ToGo",
        tagline: "Open-source reference web application for the Agave Platform",
        description: "Agave ToGo is a full featured, open source reference web application that allows you to leverage the data, computation, and collaboration features of the Agave Platform without writing a single line of code."
      },

      links: {
        home: "https://deardooley.github.io/agave-togo/app",
        project: "https://agaveapi.co/",
        source: "https://github.com/deardooley/agave-togo",
        community: "https://slackin.agaveapi.co",
        changelog: "https://github.com/deardooley/agave-togo/blob/master/CHANGELOG.md"
      },

      support: {
        issues: {
          submit: false,
          view: false,
          search: false,
        },
        source: 'github', // 'jira', 'bitbucket', 'github', 'email', 'server'
        url: "https://github.com/deardooley/agave-togo/issues",
        auth: 'server', // 'oauth', 'server', 'none'
      },

      images: {
        banner: null,
        logo: null,
        thumbnail: null,
        header: null,
        login: null
      },

      layout: {
        pageSidebarClosed: false, // sidebar menu state
        pageContentWhite: true, // set page content layout
        pageBodySolid: false, // solid body color state
        pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
      },

      assetsPath: '../assets',

      globalPath: '../assets/global',

      layoutPath: '../assets/layouts/layout',

      sidebar: {
        enable: true,
        tabs: {
          team: false,
          changelog: true,
          settings: true
        }
      },

      quicklinks: {
        enable: true,
        items: {
          'new job': "#/jobs/new/",
          'new app': "#/apps/new/",
          'upload data': "#/data/explorer/",
          'new system': "#/systems/new/"
        }
      },
      
      avatars: {
        enable: true,
        source: 'gravatar',// 'gravatar','initials','animal','profile', null,
        rounded: true
      },

      theme: {
        enableUISelector: true,
        primaryColors: {
          'blue': '#89C4F4',
          'red': '#F3565D',
          'green': '#1bbc9b',
          'purple': '#9b59b6',
          'grey': '#95a5a6',
          'yellow': '#F8CB00'
        },
      }
        
    });

