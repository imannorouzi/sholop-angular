package com.sholop.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sholop.ApplicationConfiguration;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Date;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    ApplicationConfiguration applicationConfiguration;

    @Autowired
    public FileStorageService(ApplicationConfiguration applicationConfiguration) {
        this.applicationConfiguration = applicationConfiguration;
        this.fileStorageLocation = Paths.get(applicationConfiguration.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public String storeFile(MultipartFile file, String filename, String subDir) throws Exception {
        // Normalize file name

        try {

            Path fileLocation = Paths.get(applicationConfiguration.getUploadDir() + subDir)
                    .toAbsolutePath().normalize();
            // Check if the file's name contains invalid characters
            if(filename.contains("..")) {
                throw new Exception("Sorry! Filename contains invalid path sequence " + filename);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = fileLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException ex) {
            throw new Exception("Could not store file " + filename + ". Please try again!", ex);
        }
    }

    public String storeFile(InputStream is, String filename, String subDir) throws Exception {
        try {
            Path fileLocation = Paths.get(applicationConfiguration.getUploadDir() + subDir)
                    .toAbsolutePath().normalize();
            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = fileLocation.resolve(filename);
            Files.copy(is, targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException ex) {
            throw new Exception("Could not store file " + filename + ". Please try again!", ex);
        }
    }

    public String generateQRCodeImage(String uuid)
            throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(uuid, BarcodeFormat.QR_CODE, 200, 200);

        String filename = "qr_code_" + (new Date()).toString().replaceAll(" ", "") + ".png";

        Path fileLocation = Paths.get(applicationConfiguration.getUploadDir() + "/QRCodes")
                .toAbsolutePath().normalize();
        // Copy file to the target location (Replacing existing file with the same name)
        Path targetLocation = fileLocation.resolve(filename);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", targetLocation);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/download/QRCodes/")
                .path(filename)
                .toUriString();
        return Utils.fixUri(fileDownloadUri);

    }

    public Resource loadFileAsResource(String fileName, String subDir) throws Exception {
        try {
            Path fileLocation = Paths.get(applicationConfiguration.getUploadDir() + subDir)
                    .toAbsolutePath().normalize();
            Path filePath = fileLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new Exception("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new Exception("File not found " + fileName, ex);
        }
    }

    public String downloadMap(double latitude,
                                     double longitude) {

        String filename = "venue_" + (new Date()).toString().replaceAll(" ", "") + ".png";

        String url = "https://maps.googleapis.com/maps/api/staticmap?" +
                "center=" + latitude +"%2c%20"+ longitude +
                "&markers=" + latitude + "," + longitude +
                "&zoom=16&size=400x200&key=AIzaSyDXNa76E7XTVYsZR5Q0qeOpE9LyFanBnGc";

        String fileDownloadUri = null;

        Client client = ClientBuilder.newClient();
        WebTarget target = client.target(url);
        javax.ws.rs.core.Response resp = target.request("image/png").get();


        try {
            if(resp.getStatus() == 200)
            {
                InputStream is = resp.readEntity(InputStream.class);
                this.storeFile(is, filename, "/venues");

                IOUtils.closeQuietly(is);

                fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/venues/")
                        .path(filename)
                        .toUriString();
            }
            //fetchFeedAnotherWay(is) //use for Java 7

        } catch (Exception e) {
            e.printStackTrace();
        }
        return  Utils.fixUri(fileDownloadUri);
    }


}
