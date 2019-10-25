SET MSBUILD="C:\Program Files (x86)\MSBuild\14.0\Bin\msbuild.exe"
SET APPCMD="C:\WINDOWS\System32\inetsrv\appcmd.exe"

cd ..
svn update .

call cnpm run build

%appcmd% stop site sht.dev.yidaohome.com
del ..\..\..\..\..\YDJWebsite\JieNor.AMS.SHT.Web\Website\index*.*
rd ..\..\..\..\..\YDJWebsite\JieNor.AMS.SHT.Web\Website\static\ /s /q
xcopy .\dist ..\..\..\..\..\YDJWebsite\JieNor.AMS.SHT.Web\Website /s /y /e
%appcmd% start site sht.dev.yidaohome.com
cd build