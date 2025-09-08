export interface NotificationRemoteData {
    platform:'web' | 'mobile' | 'all';
    type: 'notify' | "trigger";
    time?:number;
    foreground:boolean;
    vibration?: boolean;
    app_link?:string;
    web_link?:string;
    
    title:string;
    subtitle?:string;
    body?:string;
    icon?:string;
    largeIcon?:string;
    image?:string;
    actions:Array<{
        title:string;
        id:string;
    }>;
    importance: number;
    styles:number;
    visibility:number
}
