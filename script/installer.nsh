!macro customInstall
${If} ${FileExists} $APPDATA\hanyang-crm\database.db
  Delete $INSTDIR\database.db
${Else}
  CreateDirectory $APPDATA\hanyang-crm
  CopyFiles $INSTDIR\database.db $APPDATA\hanyang-crm
  Delete $INSTDIR\database.db
${EndIf}
!macroend