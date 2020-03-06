close all
clear all
%%

filename = 'FIRST.TXT';
log_size = 150;

%%
% fileID = fopen(filename,'r+');
% % read the first line and do nothing to them
% [tline,ltout] = fgets(fileID);
% fread(fileID,2);
% % copy all in new file
% LfileID = fopen('mybinary.bin','w');
% [rr,fil_size] = fread(fileID);
% n_logs = floor(fil_size/log_size);
% fwrite(LfileID,rr);
% fclose(fileID);
% fclose(LfileID);

misure = dir(['*.D']);
n_logs = size(misure,1);
%%
% Scan file
i = 1;
for nn=1:(n_logs)
    %[raw,count] = fread(LfileID,log_size,'uint8');
    filename = strcat('F',strcat(num2str(nn-1),'.D'))
    LfileID = fopen(filename,'r');
    if LfileID >= 0
        [~,fil_size] = fread(LfileID);
        n_logs_f = floor(fil_size/log_size);
        %return at the beginning
        fseek(LfileID,0,'bof');
        for j=1:n_logs_f
            timeStamp(i) = fread(LfileID,1,'uint32','ieee-le');
            vTime_ms(i) = fread(LfileID,1,'uint32','ieee-le');
            vTime_time_ns(i) = fread(LfileID,1,'uint32','ieee-le');
            %vGps
            vGps_latitude(i) = fread(LfileID,1,'double','ieee-le');
            vGps_longitude(i) = fread(LfileID,1,'double','ieee-le');
            vGps_altitude(i) = fread(LfileID,1,'single','ieee-le');
            vGps_height(i) = fread(LfileID,1,'single','ieee-le');
            vGps_health(i) = fread(LfileID,1,'uint8','ieee-le');
            %dw1000_usb_data_t           uwbData;
            uwbData_l(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_aaddr(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_taddr(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_txa(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_rxa(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_rng(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_rng_avg(i) = fread(LfileID,1,'uint32','ieee-le');
            uwbData_data_up(i) = fread(LfileID,1,'uint32','ieee-le');
            %Onboard Measure
            onboardMeasure_x(i) = fread(LfileID,1,'single','ieee-le');
            onboardMeasure_y(i) = fread(LfileID,1,'single','ieee-le');
            onboardMeasure_z(i) = fread(LfileID,1,'single','ieee-le');
            onboardMeasure_health(i) = fread(LfileID,1,'uint8','ieee-le');
            onboardMeasure_uwb(i) = fread(LfileID,1,'single','ieee-le');
            onboardMeasure_usRange(i) = fread(LfileID,1,'single','ieee-le');
            onboardMeasure_volt(i) = fread(LfileID,1,'single','ieee-le');
            %LocalVelocity
            lVelocity_x(i)      = fread(LfileID,1,'single','ieee-le');
            lVelocity_y(i)      = fread(LfileID,1,'single','ieee-le');
            lVelocity_z(i)      = fread(LfileID,1,'single','ieee-le'); 
            lVelocity_yaw(i)    = fread(LfileID,1,'single','ieee-le');
            % updatedtGps
            loggedData_tGpsx(i)         = fread(LfileID,1,'single','ieee-le');
            loggedData_tGpsy(i)         = fread(LfileID,1,'single','ieee-le');
            loggedData_tGpsz(i)         = fread(LfileID,1,'single','ieee-le');
            % circular coordinate
            loggedData_ccx(i)         = fread(LfileID,1,'single','ieee-le');
            loggedData_ccy(i)         = fread(LfileID,1,'single','ieee-le');
            loggedData_ccz(i)         = fread(LfileID,1,'single','ieee-le');
            %Kalman Pos
            loggedData_posx(i)         = fread(LfileID,1,'single','ieee-le');
            loggedData_posy(i)         = fread(LfileID,1,'single','ieee-le');
            loggedData_posz(i)         = fread(LfileID,1,'single','ieee-le');
            %maybe a separator here?
            loggedData_separator(i) = fread(LfileID,1,'uint32','ieee-le');
            i = i + 1;
        end
    end
    fclose(LfileID);
end


save(strrep(datestr(datetime('now')),':','_'));